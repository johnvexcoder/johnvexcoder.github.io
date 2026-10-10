export const INTRO_DURATION = 3600;
export const INTRO_PHASES = [
  [0, "system"],
  [650, "failure"],
  [1150, "restructure"],
  [2200, "stabilize"],
  [2850, "hero-morph"],
  [3600, "complete"],
] as const;
export const introPhase = (milliseconds: number) => {
  let phase: string = "system";
  for (const [at, name] of INTRO_PHASES) if (milliseconds >= at) phase = name;
  return phase;
};
export const introProgress = (milliseconds: number) => {
  const p = Math.max(0, Math.min(1, (milliseconds - 1150) / 1050));
  return p * p * (3 - 2 * p);
};
/** Bootstrap runs before first paint; CSS also completes safely if hydration fails. */
export const introBootstrap = `(()=>{try{const r=document.documentElement;const replay=${process.env.NODE_ENV === "development"}&&new URLSearchParams(location.search).has('preview-intro');const play=!matchMedia('(prefers-reduced-motion:reduce)').matches&&(replay||!sessionStorage.getItem('signature-v2-visited'));sessionStorage.setItem('signature-v2-visited','1');if(play){r.dataset.introBoot='playing';r.dataset.introStarted=String(performance.now());const stop=()=>{r.dataset.introBoot='complete';document.removeEventListener('keydown',key);document.removeEventListener('pointerdown',pointer)};const key=e=>{if(e.key==='Escape')stop()};const pointer=e=>{if(e.target.closest?.('a,button,input'))stop()};document.addEventListener('keydown',key);document.addEventListener('pointerdown',pointer,{passive:true});setTimeout(stop,4200)}}catch{}})();`;

export type NetworkPoint = readonly [number, number];
export const NETWORK_START: NetworkPoint[] = [
  [170, 90],
  [350, 90],
  [560, 90],
  [760, 90],
  [960, 90],
  [170, 270],
  [350, 270],
  [560, 270],
  [760, 270],
  [960, 270],
  [350, 450],
  [760, 450],
];
export const NETWORK_END: NetworkPoint[] = [
  [90, 100],
  [300, 55],
  [490, 110],
  [750, 65],
  [1020, 135],
  [160, 300],
  [345, 225],
  [565, 300],
  [815, 245],
  [1010, 380],
  [305, 460],
  [790, 455],
];
export const NETWORK_OLD = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [1, 6],
  [2, 7],
  [3, 8],
  [4, 9],
  [5, 6],
  [6, 7],
  [7, 8],
  [8, 9],
  [6, 10],
  [8, 11],
];
export const NETWORK_RESILIENT = [
  [0, 1],
  [1, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [1, 6],
  [6, 2],
  [2, 3],
  [2, 7],
  [7, 8],
  [3, 8],
  [8, 9],
  [4, 9],
  [6, 10],
  [10, 7],
  [7, 11],
  [11, 8],
  [10, 11],
];

export const networkPoints = (milliseconds: number): NetworkPoint[] => {
  const t = introProgress(milliseconds);
  if (t === 1) return NETWORK_END;
  return NETWORK_START.map(([x, y], i) => [
    x + (NETWORK_END[i][0] - x) * t,
    y +
      (NETWORK_END[i][1] - y) * t +
      Math.sin(t * Math.PI) * (i % 2 ? -18 : 18),
  ]);
};

/** Geometry keyframes arrive with the HTML, before hydration can run. */
export const networkGeometryCss = (() => {
  const prefix =
    ':is(.hero[data-intro="playing"],html[data-intro-boot="playing"] .hero)';
  const samples = [0, 1150, 1300, 1450, 1600, 1750, 1900, 2050, 2200, 3600];
  const shape = (points: NetworkPoint[], nodes: number[]) =>
    nodes
      .map(
        (i, n) =>
          `${n ? "L" : "M"}${points[i][0].toFixed(3)} ${points[i][1].toFixed(3)}`,
      )
      .join(" ");
  let css = "";
  for (let i = 0; i < NETWORK_END.length; i++) {
    const name = `j0-node-${i}`;
    css += `@keyframes ${name}{${samples
      .map((t) => {
        const [x, y] = networkPoints(t)[i];
        return `${t / 36}%{cx:${x}px;cy:${y}px}`;
      })
      .join("")}}`;
    css += `${prefix} .story-node:nth-child(${i + 1}){animation:${name} 3.6s linear both${i === 7 ? ",story-vulnerable 3.6s both" : ""}}`;
  }
  const routes = [
    ...NETWORK_OLD.map((nodes, i) => ({
      nodes,
      selector: `.story-old path:nth-child(${i + 1})`,
      extra: "",
    })),
    ...NETWORK_RESILIENT.map((nodes, i) => ({
      nodes,
      selector: `.story-new path:nth-child(${i + 1})`,
      extra: ",story-reroute 3.6s both",
    })),
    {
      nodes: [6, 7],
      selector: ".story-fault",
      extra: ",story-fault 3.6s both",
    },
    {
      nodes: [0, 1, 6, 10, 7, 8, 3, 4],
      selector: ".story-energy",
      extra: ",story-energy 3.6s both",
    },
    {
      nodes: [0, 5, 6, 2, 3, 8, 11, 10, 6],
      selector: ".story-verify",
      extra: ",story-verify 3.6s both",
    },
  ];
  routes.forEach(({ nodes, selector, extra }, i) => {
    const name = `j0-edge-${i}`;
    css += `@keyframes ${name}{${samples.map((t) => `${t / 36}%{d:path("${shape(networkPoints(t), nodes)}")}`).join("")}}`;
    css += `${prefix} ${selector}{animation:${name} 3.6s linear both${extra}}`;
  });
  const mobileVerify = [0, 1, 6, 10, 7, 8, 3, 4];
  css += `@keyframes j0-mobile-verify{${samples.map((t) => `${t / 36}%{d:path("${shape(networkPoints(t), mobileVerify)}")}`).join("")}}`;
  css += `@media(max-width:600px){${prefix} .story-verify{animation:j0-mobile-verify 3.6s linear both,story-verify 3.6s both}}`;
  css +=
    "@media(prefers-reduced-motion:reduce){.story-network path,.story-network circle{animation:none!important}}";
  return css;
})();
