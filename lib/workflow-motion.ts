export const workflows: Record<string, readonly string[]> = {
  "business-websites": ["Layout", "Content", "Responsive", "Inquiry"],
  "website-redesign": ["Existing", "Redesign", "Responsive", "Finished"],
  "technical-seo": [
    "Crawl",
    "Analyze",
    "Identify issue",
    "Apply fix",
    "Validate",
  ],
  "cms-solutions": ["Draft", "Review", "Approval", "Publish"],
  "crm-development": ["New lead", "Assigned", "Contacted", "Follow-up"],
  "admin-dashboard-development": ["Monday", "Tuesday", "Wednesday", "Thursday"],
  "portfolio-websites": ["Gallery", "Project detail", "Technology", "Contact"],
  "booking-systems": ["Select date", "Book now", "Payment", "Reservation"],
  "custom-solutions": [
    "Frontend",
    "API",
    "Authentication",
    "Database",
    "Response",
  ],
};
export const chartSeries = [
  [0.32, 0.55, 0.45, 0.7, 0.6, 0.8, 0.68],
  [0.5, 0.42, 0.64, 0.6, 0.8, 0.7, 0.86],
  [0.4, 0.62, 0.5, 0.82, 0.7, 0.6, 0.75],
  [0.58, 0.48, 0.72, 0.6, 0.85, 0.68, 0.9],
];

/** Crossfades have identical values at 0/1 so a repeating timeline has no reset flash. */
export function stageFrames(
  stage: number,
  count: number,
  duration: number,
): Keyframe[] {
  const fade = Math.min(0.025, 240 / duration),
    start = stage / count,
    end = (stage + 1) / count;
  return stage === 0
    ? [
        { offset: 0, opacity: 1, transform: "translateY(0)" },
        { offset: end - fade, opacity: 1, transform: "translateY(0)" },
        { offset: end, opacity: 0, transform: "translateY(-5px)" },
        { offset: 1 - fade, opacity: 0, transform: "translateY(5px)" },
        { offset: 1, opacity: 1, transform: "translateY(0)" },
      ]
    : [
        { offset: 0, opacity: 0, transform: "translateY(5px)" },
        { offset: start - fade, opacity: 0, transform: "translateY(5px)" },
        { offset: start, opacity: 1, transform: "translateY(0)" },
        { offset: end - fade, opacity: 1, transform: "translateY(0)" },
        { offset: end, opacity: 0, transform: "translateY(-5px)" },
        ...(end < 1
          ? [{ offset: 1, opacity: 0, transform: "translateY(5px)" }]
          : []),
      ];
}
/** Move between actual pipeline lanes and hide only during the return journey. */
export function travelFrames(count: number, gap: number): Keyframe[] {
  const position = (i: number) =>
    "translateX(calc(" + i * 100 + "% + " + i * gap + "px))";
  const frames: Keyframe[] = [
    { offset: 0, transform: position(0), opacity: 1 },
  ];
  for (let i = 1; i < count; i++) {
    frames.push({
      offset: i / count - 0.05,
      transform: position(i - 1),
      opacity: 1,
    });
    frames.push({
      offset: i / count,
      transform: position(i),
      opacity: 1,
      easing: "cubic-bezier(.22,1,.36,1)",
    });
  }
  frames.push({ offset: 0.94, transform: position(count - 1), opacity: 1 });
  frames.push({ offset: 0.97, transform: position(count - 1), opacity: 0 });
  frames.push({ offset: 0.98, transform: position(0), opacity: 0 });
  frames.push({ offset: 1, transform: position(0), opacity: 1 });
  return frames;
}

/** DOM data attributes are strings; malformed or flag-style markers use stage zero. */
export function scanFrames(stage: number, count: number): Keyframe[] {
  const index =
    Number.isFinite(stage) && stage >= 0 && stage < count ? stage : 0;
  const from = index / count;
  const end = Math.min(0.94, (index + 1) / count - 0.02);
  return [
    { offset: 0, transform: "scaleX(.04)" },
    ...(from ? [{ offset: from, transform: "scaleX(.04)" }] : []),
    { offset: end, transform: "scaleX(1)" },
    ...(end < 0.94
      ? [{ offset: 0.94, transform: "scaleX(1)", opacity: 1 }]
      : []),
    { offset: 0.98, transform: "scaleX(1)", opacity: 0 },
    { offset: 1, transform: "scaleX(.04)", opacity: 1 },
  ];
}
