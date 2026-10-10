import fs from "node:fs/promises";
import sharp from "sharp";
import { prepareSocial } from "./prepare-social.mjs";
await sharp("public/source/me/john_header.png")
  .resize({ width: 960 })
  .webp({ lossless: true })
  .toFile("public/source/me/portrait.webp");
const data = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
for (const p of data) {
  if (p.sourceCapture) {
    const location = `public/source/projects/${p.id}/capture.png`;
    await sharp(location)
      .resize({ width: 1120, withoutEnlargement: true })
      .webp({ quality: 84 })
      .toFile(location.replace(".png", ".webp"));
    p.image = `/source/projects/${p.id}/capture.webp`;
    p.scrollImage = p.image;
  }
}
await fs.writeFile("content/projects.json", JSON.stringify(data, null, 2));
const dimensions = {};
for (const p of data)
  for (const key of [
    "image",
    "scrollImage",
    "imageFallback",
    "logo",
    "logoFallback",
  ]) {
    const name = p[key];
    if (!name?.startsWith("/source/")) continue;
    try {
      const meta = await sharp(`public${name}`).metadata();
      dimensions[name] = { width: meta.width, height: meta.height };
    } catch {}
  }
await fs.writeFile("content/media.json", JSON.stringify(dimensions, null, 2));
// Sharing images use actual portrait/project captures, with no fabricated product imagery.
await prepareSocial();
await fs.mkdir("public/social", { recursive: true });
for (const p of data.filter((p) => p.image)) {
  const source = sharp(`public${p.image}`);
  const meta = await source.metadata();
  // Preserve a readable upper viewport of full-page captures rather than shrinking the entire page.
  const viewportHeight = Math.min(
    meta.height,
    Math.round((meta.width * 630) / 1200),
  );
  const image = await source
    .extract({ left: 0, top: 0, width: meta.width, height: viewportHeight })
    .resize(1120, 550, { fit: "contain", background: "#080e18" })
    .jpeg({ quality: 88 })
    .toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: "#080e18" },
  })
    .composite([{ input: image, left: 40, top: 40 }])
    .jpeg({ quality: 88 })
    .toFile(`public/social/${p.id}.jpg`);
}
console.log(
  "Portrait, captures, dimensions and genuine page-specific social images prepared.",
);
