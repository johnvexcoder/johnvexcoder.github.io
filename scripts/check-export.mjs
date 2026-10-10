import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import zlib from "node:zlib";
const root = path.resolve("out");
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const routes = ["/", "/404/", ...projects.map((p) => `/work/${p.id}/`)];
let checked = 0;
const scripts = new Set();
for (const route of routes) {
  const filename = path.join(root, route, "index.html");
  const html = await fs.readFile(filename, "utf8");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    route + " has one h1",
  );
  assert.ok(!html.includes("If it works, I ask how it can work better."));
  for (const [, attribute, value] of html.matchAll(
    /\b(href|src)="([^"#]*)"/g,
  )) {
    if (!value.startsWith("/") || value.startsWith("//")) continue;
    const local = value.split(/[?#]/)[0];
    let target = path.join(root, decodeURIComponent(local));
    if (local.endsWith("/")) target = path.join(target, "index.html");
    assert.ok(
      await fs.stat(target).catch(() => false),
      `${route} missing ${value}`,
    );
    checked++;
    if (attribute === "src" && local.endsWith(".js")) scripts.add(local);
  }
  assert.ok(html.includes("Designed &amp; Developed by"));
  assert.ok(html.includes('rel="canonical"'));
}
for (const file of [
  "404.html",
  "robots.txt",
  "sitemap.xml",
  "social.png",
  "resume.pdf",
])
  await fs.access(path.join(root, file));
const errorPage = await fs.readFile(path.join(root, "404/index.html"), "utf8");
assert.ok(errorPage.includes("noindex"));
assert.ok(errorPage.includes("404 — Find a new connection"));
assert.ok(errorPage.includes("Curiosity"));
const fallback = await fs.readFile(path.join(root, "404.html"), "utf8");
assert.ok(fallback.includes("Curiosity"));
const home = await fs.readFile(path.join(root, "index.html"), "utf8");
for (const anchor of [
  "main",
  "home",
  "projects",
  "homelab",
  "about",
  "experience",
  "skills",
  "services",
  "contact",
])
  assert.ok(home.includes(`id="${anchor}"`), anchor);
const js = [];
for (const url of scripts) {
  const file = await fs.readFile(path.join(root, url));
  js.push({ url, bytes: file.length, gzipBytes: zlib.gzipSync(file).length });
}
const result = {
  routes: routes.length,
  localReferences: checked,
  scriptFilesAcrossHomeAndCases: js.length,
  totalScriptBytes: js.reduce((n, p) => n + p.bytes, 0),
  totalScriptGzipBytes: js.reduce((n, p) => n + p.gzipBytes, 0),
  note: "Union of scripts referenced by all exported pages, not a Lighthouse score or one-page network measurement.",
  scripts: js,
};
await fs.writeFile(
  "docs/EXPORT-CHECKS.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify({ ...result, scripts: undefined }, null, 2));
