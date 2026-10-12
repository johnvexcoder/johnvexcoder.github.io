import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import sharp from "sharp";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const projects = read("content/projects.json");
const original = JSON.parse(
  JSON.stringify(
    vm.runInNewContext(
      fs.readFileSync("tests/fixtures/source-projects.js", "utf8") +
        "\nPROJECTS_DATA",
      {},
      { timeout: 1000 },
    ),
  ),
);
test("all fourteen original projects preserve identities, technologies, assets and public reference destinations", () => {
  assert.equal(original.length, 14);
  for (const p of original) {
    const actual = projects.find((x) => x.id === p.id);
    assert.ok(actual, p.id);
    for (const key of [
      "name",
      "category",
      "technologies",
      "github",
      "docs",
      "release",
      "openSource",
      "featured",
    ])
      assert.deepEqual(actual[key], p[key], `${p.id}.${key}`);
    if (p.id === "movieflix")
      assert.equal(
        actual.demo,
        null,
        "private runtime is not a public destination",
      );
    else if (!p.demo?.startsWith("projects/"))
      assert.equal(actual.demo, p.demo);
  }
  assert.deepEqual([...new Set(projects.map((p) => p.category))].sort(), [
    "CLI",
    "Infrastructure",
    "Software",
    "Web",
  ]);
});
test("five owner-confirmed recent projects use their exact live URLs and actual source captures", () => {
  const urls = {
    jnglo: "https://jnglo.vercel.app/",
    arkosenyo: "https://demo-arkosenyo.vercel.app/",
    taitechmarine: "https://demo-taitechmarine.vercel.app/",
    shoesonthego: "https://shoesonthego.vercel.app/",
    archeon: "https://demo-archeon.vercel.app",
  };
  assert.equal(projects.length, 19);
  assert.equal(new Set(projects.map((p) => p.id)).size, 19);
  for (const [id, url] of Object.entries(urls)) {
    const p = projects.find((p) => p.id === id);
    assert.equal(p.demo, url);
    assert.equal(p.status, "demo");
    assert.ok(p.sourceCapture);
    assert.ok(p.image.endsWith("capture.webp"));
  }
});
test("all five authentic client reviews are preserved, including masked names and ratings", () => {
  const source = read("tests/fixtures/source-testimonials.json");
  const current = read("content/testimonials.json");
  assert.equal(current.length, 5);
  assert.deepEqual(
    current,
    source.map((p) => ({
      ...p,
      avatar: p.avatar.replace("src/img/", "/source/"),
    })),
  );
});
test("assets referenced by projects, reviews, fonts and résumé exist", () => {
  for (const p of projects)
    for (const key of [
      "image",
      "scrollImage",
      "imageFallback",
      "logo",
      "logoFallback",
    ])
      if (p[key]) assert.ok(fs.existsSync("public" + p[key]), p[key]);
  for (const r of read("content/testimonials.json"))
    assert.ok(fs.existsSync("public" + r.avatar));
  for (const f of [
    "public/resume.pdf",
    "public/social.png",
    "public/fonts/SignatureSans.woff2",
    "public/fonts/SignatureMono.woff2",
  ])
    assert.ok(fs.existsSync(f), f);
});
test("portrait retains transparency and long captures retain measured image dimensions", async () => {
  const portrait = await sharp("public/source/me/portrait.webp").metadata();
  assert.ok(portrait.hasAlpha);
  assert.equal(portrait.width, 960);
  const media = read("content/media.json");
  for (const p of projects.filter((p) => p.scrollImage)) {
    const m = await sharp("public" + p.scrollImage).metadata();
    assert.equal(media[p.scrollImage].width, m.width);
    assert.equal(media[p.scrollImage].height, m.height);
  }
});
test("original source file hashes remain unchanged", (context) => {
  if (
    !fs.existsSync("/home/j0hn/Projects/My-Portfolio") &&
    !fs.existsSync("/home/j0hn/Projects/Signature-Portfolio")
  ) {
    context.skip(
      "Reference repositories are not present on this machine; see the recorded source audit.",
    );
    return;
  }
  const snapshot = read("docs/SOURCE-SNAPSHOT.json");
  for (const [file, hash] of Object.entries(snapshot))
    assert.equal(
      crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"),
      hash,
      file,
    );
});
test("original local demos have a working static document destination", () => {
  for (const p of projects.filter((p) => p.demo?.startsWith("/")))
    assert.ok(fs.existsSync(path.join("public", p.demo, "index.html")), p.id);
});
test("skill logos are locally available and all project sharing images use real existing assets", async () => {
  const sources = read("docs/SKILL-ICON-SOURCES.json");
  assert.equal(sources.sources.length, 26);
  for (const source of sources.sources) {
    const svg = fs.readFileSync(
      `public/icons/skills/${source.name}.svg`,
      "utf8",
    );
    assert.ok(svg.includes("<svg"));
    assert.ok(!/<script|<foreignObject|onload=/i.test(svg));
  }
  for (const project of projects.filter((p) => p.image)) {
    const meta = await sharp(`public/social/${project.id}.jpg`).metadata();
    assert.equal(meta.width, 1200);
    assert.equal(meta.height, 630);
  }
  const social = await sharp("public/social.png").metadata();
  assert.equal(social.width, 1200);
  assert.equal(social.height, 630);
});
