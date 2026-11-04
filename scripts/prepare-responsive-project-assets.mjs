import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Explicit authoring step: preserve full-resolution originals and create only
// missing density/responsive variants. No deployment or image service is needed.
const mediaPath = "content/media.json";
const media = JSON.parse(await fs.readFile(mediaPath, "utf8"));
const results = [];
for (const [src, widths, quality = 86] of [
  ["/source/projects/nexora-icon.webp", [32, 48, 72, 96]],
  ["/source/projects/compressme/compressme-icon.webp", [32, 48, 72, 96]],
  ["/source/projects/compressme/compressme-screenshot.webp", [480, 768, 1280]],
  ["/source/projects/jenica-portfolio/jenica-portfolio-scroll.webp", [768], 84],
]) {
  const original = path.join("public", src);
  const metadata = await sharp(original).metadata();
  const sources = [];
  for (const width of widths) {
    const target = src.replace(/\.webp$/, `-${width}.webp`);
    const file = path.join("public", target);
    if (!(await fs.stat(file).catch(() => null)))
      await sharp(original)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, alphaQuality: 100, effort: 6 })
        .toFile(file);
    const variant = await sharp(file).metadata();
    media[target] = { width: variant.width, height: variant.height };
    sources.push({ src: target, width: variant.width });
    results.push({
      src: target,
      ...media[target],
      bytes: (await fs.stat(file)).size,
    });
  }
  media[src] = {
    ...media[src],
    width: metadata.width,
    height: metadata.height,
    sources: [
      ...new Map(
        [
          ...(media[src]?.sources || []),
          ...sources,
          { src, width: metadata.width },
        ].map((source) => [source.width, source]),
      ).values(),
    ].sort((a, b) => a.width - b.width),
  };
}
const portrait = "public/source/me/portrait-512.webp";
if (!(await fs.stat(portrait).catch(() => null)))
  await sharp("public/source/me/portrait.webp")
    .resize({ width: 512 })
    .webp({ quality: 86, alphaQuality: 100, effort: 6 })
    .toFile(portrait);
results.push({
  src: "/source/me/portrait-512.webp",
  bytes: (await fs.stat(portrait)).size,
});
await fs.writeFile(mediaPath, JSON.stringify(media, null, 2) + "\n");
console.log(
  JSON.stringify({ originalsPreserved: true, variants: results }, null, 2),
);
