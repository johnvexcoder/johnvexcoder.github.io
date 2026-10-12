import fs from "node:fs/promises";
import sharp from "sharp";
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const ids = [
  "arkosenyo",
  "taitechmarine",
  "donut-house",
  "archeon",
  "shoesonthego",
  "compressme",
  "jenica-portfolio",
  "jaron-portfolio",
  "movieflix",
];
await fs.mkdir("public/services/work", { recursive: true });
for (const id of ids) {
  const project = projects.find((p) => p.id === id);
  for (const width of [480, 960])
    await sharp(`public${project.image}`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`public/services/work/${id}-${width}.webp`);
}
