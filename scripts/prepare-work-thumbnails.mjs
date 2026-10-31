import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
const root = path.resolve("public"),
  target = path.join(root, "preview-thumbnails"),
  cacheFile = ".next/cache/work-thumbnails.json";
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const cache = JSON.parse(
    await fs.readFile(cacheFile, "utf8").catch(() => "{}"),
  ),
  next = {},
  manifest = {};
await fs.mkdir(target, { recursive: true });
let generated = 0;
for (const project of projects) {
  if (!project.image) continue;
  const input = path.resolve(root, "." + project.image);
  if (!input.startsWith(root + path.sep))
    throw Error("Invalid project asset path");
  const source = await fs.readFile(input),
    hash = createHash("sha256")
      .update(source)
      .update("north-cover-webp-q82-v1")
      .digest("hex");
  const sources = [384, 768].map((width) => ({
    src: `/preview-thumbnails/${project.id}-${width}.webp`,
    width,
  }));
  for (const item of sources) {
    const file = path.join(root, item.src);
    if (cache[project.id] === hash && (await fs.stat(file).catch(() => false)))
      continue;
    await sharp(source)
      .rotate()
      .resize(item.width, Math.round((item.width * 10) / 16), {
        fit: "cover",
        position: "north",
      })
      .webp({ quality: 82, effort: 5 })
      .toFile(file);
    generated++;
  }
  next[project.id] = hash;
  manifest[project.id] = { width: 768, height: 480, sources };
}
await fs.mkdir(path.dirname(cacheFile), { recursive: true });
await fs.writeFile(cacheFile, JSON.stringify(next));
const text = JSON.stringify(manifest, null, 2) + "\n";
if (
  (await fs
    .readFile("content/work-thumbnails.json", "utf8")
    .catch(() => "")) !== text
)
  await fs.writeFile("content/work-thumbnails.json", text);
console.log(
  `Prepared ${Object.keys(manifest).length} still project previews (${generated} thumbnail files refreshed); full screenshots retained.`,
);
