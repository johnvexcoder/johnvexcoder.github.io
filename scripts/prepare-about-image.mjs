import fs from "node:fs/promises";
import sharp from "sharp";
const source = "public/source/me/john_aboutme.webp";
const original = await sharp(source).metadata();
const result = {
  source,
  width: original.width,
  height: original.height,
  bytes: (await fs.stat(source)).size,
  variants: [],
};
for (const width of [480, 768]) {
  const file = `public/source/me/john_aboutme-${width}.webp`;
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84 })
    .toFile(file);
  const image = await sharp(file).metadata();
  result.variants.push({
    file,
    width: image.width,
    height: image.height,
    bytes: (await fs.stat(file)).size,
  });
}
await fs.writeFile(
  "docs/SEO-ABOUT-IMAGE-CHECKS.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
