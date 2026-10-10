import fs from "node:fs/promises";
import sharp from "sharp";
const original = "public/source/me/portrait.webp";
const result = {
  original: { bytes: (await fs.stat(original)).size, width: 960 },
  variants: [],
};
for (const width of [320, 480, 640]) {
  const file = `public/source/me/portrait-${width}.webp`;
  await sharp(original).resize({ width }).webp({ lossless: true }).toFile(file);
  const meta = await sharp(file).metadata();
  result.variants.push({
    file,
    width: meta.width,
    height: meta.height,
    bytes: (await fs.stat(file)).size,
    hasAlpha: meta.hasAlpha,
  });
}
await fs.writeFile(
  "docs/SEO-IMAGE-CHECKS.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(result);
