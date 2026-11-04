import pages from "../content/site-pages.json" with { type: "json" };
import services from "../content/service-routes.json" with { type: "json" };
import projects from "../content/projects.json" with { type: "json" };
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { publicDocuments } from "../lib/public-documents.ts";
const docs = publicDocuments();
assert.equal(new Set(docs.map((d) => d.route)).size, docs.length);
await fs.mkdir("public/markdown", { recursive: true });
for (const doc of docs) {
  assert.match(doc.id, /^[a-z0-9-]+$/);
  await fs.writeFile(`public${doc.markdownPath}`, doc.markdown);
}
console.log(
  `Generated ${docs.length} Markdown mirrors from shared public content.`,
);

// Browser analytics needs only approved routes, titles and project IDs, not case data.
const catalog = {
  pages: {
    ...Object.fromEntries(pages.map((page) => [page.route, page.title])),
    "/services/": "Services and Solutions | J0hnvexcoder",
    ...Object.fromEntries(
      services.map((service) => [service.route, service.title]),
    ),
    "/404/": "Page not found | J0hnvexcoder",
    ...Object.fromEntries(
      projects.map((project) => [
        `/work/${project.id}/`,
        `${project.name} | J0hnvexcoder`,
      ]),
    ),
  },
  projectIds: projects.map((project) => project.id),
};
const catalogText = JSON.stringify(catalog, null, 2) + "\n";
if (
  (await fs
    .readFile("content/analytics-catalog.json", "utf8")
    .catch(() => "")) !== catalogText
)
  await fs.writeFile("content/analytics-catalog.json", catalogText);

const searchText =
  JSON.stringify(
    projects.map(({ id, name, category, technologies }) => ({
      id,
      name,
      category,
      technologies,
    })),
    null,
    2,
  ) + "\n";
if (
  (await fs.readFile("content/project-search.json", "utf8").catch(() => "")) !==
  searchText
)
  await fs.writeFile("content/project-search.json", searchText);
