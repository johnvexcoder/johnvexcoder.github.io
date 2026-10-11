import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import sharp from "sharp";
import {
  resolveSiteOrigin,
  resolveIndexing,
  projectSearchTitle,
} from "../lib/seo-policy.ts";

test("canonical origins cannot silently discard paths or accept preview credentials", () => {
  assert.equal(resolveSiteOrigin(), "https://johnvexcoder.github.io");
  assert.equal(
    resolveSiteOrigin("https://johnvexcoder.github.io/"),
    "https://johnvexcoder.github.io",
  );
  for (const value of [
    "http://example.com",
    "https://example.com/portfolio",
    "https://example.com/?preview=1",
    "https://example.com/#home",
    "https://user:pass@example.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://example.com:3003",
  ]) {
    assert.throws(
      () => resolveSiteOrigin(value),
      /confirmed HTTPS root origin/,
    );
  }
});

test("preview indexing is explicit and invalid configuration fails instead of indexing silently", () => {
  assert.equal(resolveIndexing(), true);
  assert.equal(resolveIndexing("production"), true);
  assert.equal(resolveIndexing("preview"), false);
  assert.throws(() => resolveIndexing("staging"));
});

test("project metadata distinguishes all actual work without changing the source catalog", async () => {
  const projects = JSON.parse(
    await fs.readFile("content/projects.json", "utf8"),
  );
  const titles = projects.map(projectSearchTitle);
  assert.equal(new Set(titles).size, projects.length);
  assert.ok(titles.every((title, i) => title.startsWith(projects[i].name)));
});

test("responsive portrait variants preserve aspect ratio, alpha and useful byte reductions", async () => {
  const original = await fs.stat("public/source/me/portrait.webp");
  for (const width of [320, 480, 640]) {
    const file = `public/source/me/portrait-${width}.webp`;
    const image = await sharp(file).metadata();
    assert.equal(image.width, width);
    assert.equal(image.height / image.width, 1.25);
    assert.ok(image.hasAlpha);
    assert.ok((await fs.stat(file)).size < original.size * 0.5);
  }
});
