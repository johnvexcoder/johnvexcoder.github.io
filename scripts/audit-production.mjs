import fs from "node:fs/promises";
import { parse } from "parse5";
import { confirmedSiteOrigin } from "../lib/seo-policy.ts";
const origin = confirmedSiteOrigin;
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const services = JSON.parse(
  await fs.readFile("content/service-routes.json", "utf8"),
);
const attrs = (node) =>
  Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
function* walk(node) {
  yield node;
  for (const c of node.childNodes || []) yield* walk(c);
}
const txt = (node) =>
  node
    ? [...walk(node)]
        .filter((n) => n.nodeName === "#text")
        .map((n) => n.value)
        .join("")
    : "";
async function request(path) {
  try {
    const response = await fetch(new URL(path, origin), {
      redirect: "manual",
      signal: AbortSignal.timeout(25000),
    });
    const body = await response.text();
    return {
      path,
      status: response.status,
      location: response.headers.get("location"),
      body,
    };
  } catch (error) {
    return { path, error: error.message };
  }
}
const sitemap = await request("/sitemap.xml");
const robots = await request("/robots.txt");
const discovered = [
  ...(sitemap.body || "").matchAll(/(?<!image:)<loc>([^<]+)<\/loc>/g),
].map((m) => new URL(m[1]).pathname);
const intended = [
  "/",
  "/services/",
  ...services.map((s) => s.route),
  ...projects.map((p) => `/work/${p.id}/`),
];
const paths = [...new Set([...discovered, ...intended])];
const pages = [];
for (let i = 0; i < paths.length; i += 4) {
  const batch = await Promise.all(paths.slice(i, i + 4).map(request));
  for (const row of batch) {
    const nodes = [...walk(parse(row.body || ""))];
    const meta = (key) =>
      nodes
        .filter((n) => n.tagName === "meta")
        .map(attrs)
        .find((a) => a.name === key || a.property === key)?.content;
    const canonical = nodes
      .filter((n) => n.tagName === "link" && attrs(n).rel === "canonical")
      .map((n) => attrs(n).href);
    const localFile = `out${row.path}index.html`;
    const local = await fs.readFile(localFile, "utf8").catch(() => "");
    const localNodes = [...walk(parse(local))];
    pages.push({
      path: row.path,
      status: row.status,
      error: row.error,
      title: txt(nodes.find((n) => n.tagName === "title")),
      description: meta("description"),
      canonical,
      robots: meta("robots"),
      h1: nodes.filter((n) => n.tagName === "h1").map(txt),
      structuredDataBlocks: nodes.filter(
        (n) =>
          n.tagName === "script" && attrs(n).type === "application/ld+json",
      ).length,
      internalLinks: nodes
        .filter((n) => n.tagName === "a")
        .map(attrs)
        .map((a) => a.href)
        .filter((href) => href?.startsWith("/")),
      inProductionSitemap: discovered.includes(row.path),
      inLocalExport: !!local,
      localTitle: txt(localNodes.find((n) => n.tagName === "title")),
      matchesLocalTitle:
        txt(nodes.find((n) => n.tagName === "title")) ===
        txt(localNodes.find((n) => n.tagName === "title")),
    });
    console.log(row.path, row.status || row.error);
  }
}
const variants = [];
for (const path of [
  "/services",
  "/?preview-intro=1",
  "/__portfolio-audit-missing__/",
  "/google1c03abb64b8da92a.html",
]) {
  const row = await request(path);
  variants.push({
    path,
    status: row.status,
    location: row.location,
    error: row.error,
  });
}
const report = {
  checkedAt: new Date().toISOString(),
  origin,
  productionSitemap: { status: sitemap.status, routes: discovered },
  robots: { status: robots.status, text: robots.body },
  pages,
  variants,
  note: "Read-only public HTTP/initial HTML observations. No private Search Console, field CWV or indexing evidence.",
};
await fs.mkdir("docs/seo", { recursive: true });
await fs.writeFile(
  "docs/seo/PRODUCTION-ROUTES.json",
  JSON.stringify(report, null, 2) + "\n",
);
