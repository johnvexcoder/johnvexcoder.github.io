import test from "node:test";
import assert from "node:assert/strict";
import { analyticsPages, projectIds } from "../lib/analytics-config.mjs";
import { publicDocuments } from "../lib/public-documents.ts";
import projects from "../content/projects.json" with { type: "json" };
import services from "../content/services.json" with { type: "json" };

test("lean analytics retains the exact public route and project allowlists", () => {
  assert.deepEqual(
    Object.keys(analyticsPages).sort(),
    [...publicDocuments().map((p) => p.route), "/404/"].sort(),
  );
  assert.deepEqual([...projectIds].sort(), projects.map((p) => p.id).sort());
  assert.ok(
    Object.values(analyticsPages).every((title) => typeof title === "string"),
  );
});

test("service text exports retain buyer answers and project evidence boundaries", () => {
  const docs = publicDocuments();
  for (const service of services.pages) {
    const text = docs.find((d) => d.route === service.route).markdown;
    for (const [question, answer] of service.faq) {
      assert.ok(text.includes(question), service.id);
      assert.ok(text.includes(answer), service.id);
    }
    assert.ok(text.includes(service.evidence), service.id);
    for (const item of service.scope)
      assert.ok(text.includes(item), service.id);
  }
  const atlas = docs.find(
    (d) => d.route === "/work/atlas-enterprise/",
  ).markdown;
  assert.match(atlas, /browser[- ]local/i);
  assert.match(atlas, /demonstration/i);
});

test("404 project search keeps the original results without rich case-study data", async () => {
  const { default: directory } = await import(
    "../content/project-search.json",
    { with: { type: "json" } }
  );
  const search = (items, query) =>
    items
      .filter((p) =>
        `${p.name} ${p.category} ${p.technologies.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
      )
      .slice(0, 3)
      .map((p) => p.id);
  for (const query of [
    "",
    "no-such-project",
    ...projects.flatMap((p) => [p.name, p.category, ...p.technologies]),
  ])
    assert.deepEqual(search(directory, query), search(projects, query), query);
  for (const item of directory)
    assert.deepEqual(Object.keys(item).sort(), [
      "category",
      "id",
      "name",
      "technologies",
    ]);
});

test("ARKOSENYO image descriptions agree with the client-project demonstration scope", async () => {
  const { default: studies } = await import("../content/case-studies.json", {
    with: { type: "json" },
  });
  const project = projects.find((p) => p.id === "arkosenyo");
  const study = studies.find((p) => p.id === "arkosenyo");
  assert.equal(study.alt, project.imageAlt);
  assert.match(study.alt, /client website demonstration/i);
  assert.match(study.status, /separate production launch is not asserted/i);
});
