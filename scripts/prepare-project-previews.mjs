import fs from "node:fs/promises";
import sharp from "sharp";
const sources = {
  bedrock: "bedrock",
  aurvel: "Aurvel",
  "rajt-marine-services": "RAJ & T Marine Services",
  aurevia: "aurevia",
  voyara: "voyara",
  aurelia: "aurelia",
};
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const media = JSON.parse(await fs.readFile("content/media.json", "utf8"));
const report = [];
for (const [id, dir] of Object.entries(sources)) {
  const directory = `public/source/projects/${dir}`;
  const files = (await fs.readdir(directory)).filter((file) =>
    file.endsWith(".png"),
  );
  if (files.length !== 1)
    throw new Error(`${id}: expected exactly one original screenshot`);
  const original = `${directory}/${files[0]}`;
  const project = projects.find((p) => p.id === id);
  await sharp(original)
    .resize({ width: 1120, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(`public${project.scrollImage}`);
  const metadata = await sharp(`public${project.scrollImage}`).metadata();
  media[project.scrollImage] = {
    width: metadata.width,
    height: metadata.height,
  };
  const cropHeight = Math.min(
    metadata.height,
    Math.round((metadata.width * 630) / 1200),
  );
  await sharp(`public${project.image}`)
    .extract({ left: 0, top: 0, width: metadata.width, height: cropHeight })
    .resize(1200, 630)
    .jpeg({ quality: 88 })
    .toFile(`public/social/${id}.jpg`);
  report.push({
    id,
    originalBytes: (await fs.stat(original)).size,
    webpBytes: (await fs.stat(`public${project.image}`)).size,
    ...media[project.image],
  });
}
// Every tall preview can use smaller files on narrow screens. Originals remain untouched.
for (const project of projects.filter((p) => p.scrollImage)) {
  const src = project.scrollImage;
  const metadata = await sharp(`public${src}`).metadata();
  const variants = [];
  for (const width of [480, 960]) {
    if (width >= metadata.width) continue;
    const variant = src.replace(/\.webp$/, `-${width}.webp`);
    await sharp(`public${src}`)
      .resize({ width })
      .webp({ quality: 84, effort: 6 })
      .toFile(`public${variant}`);
    const m = await sharp(`public${variant}`).metadata();
    media[variant] = { width: m.width, height: m.height };
    variants.push({ src: variant, width: m.width });
  }
  media[src] = {
    width: metadata.width,
    height: metadata.height,
    sources: [...variants, { src, width: metadata.width }],
  };
}
await fs.writeFile("content/media.json", JSON.stringify(media, null, 2) + "\n");
await fs.mkdir("docs/seo", { recursive: true });
await fs.writeFile(
  "docs/seo/PROJECT-ASSETS.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(report);
