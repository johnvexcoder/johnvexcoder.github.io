import fs from "node:fs/promises";
import sharp from "sharp";

// Use the Hero's real portrait, bundled fonts, palette and visual hierarchy.
export async function prepareSocial() {
  const width = 1200;
  const height = 630;
  const layers = [];
  const sans = "public/fonts/AdwaitaSans.ttf";
  const mono = "public/fonts/AdwaitaMono.ttf";
  async function text(value, x, y, size, color, options = {}) {
    const font = options.mono ? "Adwaita Mono" : "Adwaita Sans";
    const markup = `<span foreground="${color}"${options.tracking ? ` letter_spacing="${options.tracking * 1024}"` : ""}>${value}</span>`;
    const input = await sharp({
      text: {
        text: markup,
        font: `${font} ${options.bold ? "Bold" : "Regular"} ${size}`,
        fontfile: options.mono ? mono : sans,
        rgba: true,
        dpi: 72,
      },
    })
      .png()
      .toBuffer();
    const meta = await sharp(input).metadata();
    layers.push({
      input,
      left: options.center ? Math.round(x - meta.width / 2) : x,
      top: y,
    });
  }
  const background =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><radialGradient id="light"><stop stop-color="#17283e"/><stop offset="1" stop-color="#0f131a"/></radialGradient></defs>
    <rect width="1200" height="630" fill="#0f131a"/><ellipse cx="600" cy="274" rx="590" ry="340" fill="url(#light)"/>
    <g fill="none" stroke="#76b7ff" stroke-opacity=".13"><circle cx="600" cy="282" r="191"/>
      <path d="M279 209L406 139L533 175L665 135L793 164L924 213L881 363L759 398L615 360L413 392L325 340Z M406 139L413 392L665 135L759 398L533 175L881 363 M279 209L615 360L924 213"/>
    </g><g fill="#76b7ff" fill-opacity=".25">
      <circle cx="279" cy="209" r="2.6"/><circle cx="406" cy="139" r="2.6"/><circle cx="533" cy="175" r="2.6"/><circle cx="665" cy="135" r="2.6"/><circle cx="793" cy="164" r="2.6"/><circle cx="924" cy="213" r="2.6"/><circle cx="881" cy="363" r="2.6"/><circle cx="759" cy="398" r="2.6"/><circle cx="413" cy="392" r="2.6"/>
    </g>
    <g fill="none" stroke="#ffffff22"><rect x="48" y="34" width="42" height="42" rx="11"/><path d="M48 96H1152 M48 573H1152"/></g>
    <circle cx="860" cy="55" r="3" fill="#76b7ff"/>
    <g stroke="#8aa5c54a" fill="#111925">
      <rect x="65" y="200" width="184" height="99" rx="5"/><path d="M76 224H238 M76 244H166"/>
      <rect x="77" y="258" width="47" height="28"/><rect x="132" y="258" width="47" height="28"/><rect x="187" y="258" width="47" height="28"/>
      <rect x="965" y="213" width="41" height="31" rx="3"/><rect x="1038" y="213" width="41" height="31" rx="3"/><rect x="1111" y="213" width="41" height="31" rx="3"/><path d="M1013 228H1031 M1086 228H1104"/>
    </g><g fill="#8295af"><circle cx="78" cy="212" r="1.6"/><circle cx="85" cy="212" r="1.6"/><circle cx="92" cy="212" r="1.6"/></g>
  </svg>`);
  await text("J0", 58, 44, 22, "#76b7ff", { mono: true });
  await text("J0hnvexcoder", 105, 39, 19, "#eff4fb", { bold: true });
  await text("CODE · SYSTEMS · SECURITY", 105, 66, 7, "#8193ae", {
    mono: true,
    tracking: 1,
  });
  await text("OPEN TO REMOTE ROLES &amp; FREELANCE", 873, 50, 9, "#b1bccd", {
    mono: true,
  });
  await text("J0hnvexcoder", 600, 225, 137, "#e4edff", {
    bold: true,
    center: true,
    tracking: -6,
  });
  const portrait = await sharp("public/source/me/portrait.webp")
    .resize({ height: 408 })
    .ensureAlpha()
    .toBuffer();
  const portraitMeta = await sharp(portrait).metadata();
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${portraitMeta.width}" height="408"><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="white"/><stop offset=".69" stop-color="white"/><stop offset=".85" stop-color="white" stop-opacity=".65"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#fade)"/></svg>`,
  );
  const faded = await sharp(portrait)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  layers.push({
    input: faded,
    left: Math.round((width - portraitMeta.width) / 2),
    top: 108,
  });
  await text("INTERFACE / ASSEMBLING", 65, 177, 8, "#a1b1c8", {
    mono: true,
    tracking: 1,
  });
  await text("INFRASTRUCTURE / CONNECTED", 958, 177, 8, "#a1b1c8", {
    mono: true,
  });
  await text("HOST", 974, 225, 6, "#b1bccd", { mono: true });
  await text("VM", 1052, 225, 6, "#b1bccd", { mono: true });
  await text("APP", 1124, 225, 6, "#b1bccd", { mono: true });
  await text("WEB DEVELOPMENT", 65, 360, 8, "#8193ae", {
    mono: true,
    tracking: 1,
  });
  await text("SOFTWARE &amp; SYSTEMS", 65, 376, 8, "#8193ae", {
    mono: true,
    tracking: 1,
  });
  await text("VERIFY · DEPLOY · UNDERSTAND", 961, 360, 7, "#8193ae", {
    mono: true,
  });
  await text(
    "WEB DEVELOPER · FULL-STACK · LINUX &amp; INFRASTRUCTURE",
    600,
    438,
    8,
    "#99abc4",
    { mono: true, center: true, tracking: 1 },
  );
  await text("From interface", 600, 466, 43, "#eff4fb", {
    center: true,
    tracking: -2,
  });
  await text("to infrastructure.", 600, 514, 43, "#76b7ff", {
    center: true,
    tracking: -2,
  });
  await text("JOHNVEXCODER.GITHUB.IO", 48, 597, 8, "#b1bccd", {
    mono: true,
    tracking: 1,
  });
  await text("JOHN ANGELO DE JOYA / PHILIPPINES", 872, 597, 8, "#b1bccd", {
    mono: true,
  });
  await sharp(background)
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile("public/social.png");
  return { width, height, bytes: (await fs.stat("public/social.png")).size };
}

if (process.argv[1]?.endsWith("prepare-social.mjs"))
  console.log("Hero-branded sharing image prepared:", await prepareSocial());
