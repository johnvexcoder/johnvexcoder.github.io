import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const projects = read("content/projects.json");
const studies = read("content/case-studies.json");
const services = read("content/services.json");
test("every existing project has an evidence-backed case and valid service/related destinations", () => {
  assert.equal(studies.length, 19);
  assert.deepEqual(
    new Set(studies.map((s) => s.id)),
    new Set(projects.map((p) => p.id)),
  );
  for (const study of studies) {
    assert.ok(services.pages.some((service) => service.id === study.service));
    for (const id of study.related)
      assert.ok(projects.some((p) => p.id === id) && id !== study.id);
    assert.ok(study.features.length >= 3);
    assert.ok(study.decisions.length > 150);
  }
  assert.equal(new Set(studies.map((s) => s.meta)).size, 19);
});
test("seven services routes combine redesign and exclude thin or unsupported client-result pages", () => {
  assert.deepEqual(
    [services.main.route, ...services.pages.map((p) => p.route)],
    [
      "/services/",
      "/services/business-websites/",
      "/services/technical-seo/",
      "/services/cms-solutions/",
      "/services/portfolio-websites/",
      "/services/booking-systems/",
      "/services/custom-solutions/",
    ],
  );
  for (const service of services.pages) {
    assert.ok(service.faq.length >= 2);
    assert.ok(service.scope.length >= 4);
    assert.ok(service.distinctSection.length > 150);
    for (const id of service.examples)
      assert.ok(projects.some((p) => p.id === id));
  }
  assert.deepEqual(
    services.pages.find((p) => p.id === "booking-systems").examples,
    ["taitechmarine"],
  );
  assert.equal(new Set(services.pages.map((p) => p.description)).size, 6);
});
test("public content withholds the private runtime, pricing, quotation documents and added personal details", () => {
  const publicCopy = JSON.stringify({ projects, studies, services });
  assert.doesNotMatch(
    publicCopy,
    /\.ts\.net|100\.\d+\.\d+\.\d+|₱|PHP\s*\d|\d[\d,]*\s*pesos|starting (?:at|from)|price range|\.docx|\/home\/j0hn\/|May 21 2025/i,
  );
  assert.equal(projects.find((p) => p.id === "movieflix").demo, null);
  for (const id of [
    "donut-house",
    "your-coffee",
    "jnglo",
    "arkosenyo",
    "taitechmarine",
    "shoesonthego",
    "archeon",
    "starbucks-portal",
    "smart-expense",
  ])
    assert.equal(projects.find((p) => p.id === id).status, "demo");
  assert.match(
    studies.find((p) => p.id === "jaron-portfolio").result,
    /does not submit or store/,
  );
  assert.match(studies.find((p) => p.id === "archeon").result, /does not send/);
});

test("owner-confirmed client classification is consistent and supersedes the old concept assumption", () => {
  for (const id of [
    "jenica-portfolio",
    "jaron-portfolio",
    "arkosenyo",
    "taitechmarine",
  ]) {
    const study = studies.find((p) => p.id === id);
    assert.equal(
      projects.find((p) => p.id === id).classification,
      "Client work",
    );
    assert.equal(study.classification, "Client work");
    assert.doesNotMatch(
      JSON.stringify(study),
      /unsolicited|unauthorized|independent redesign|not.*commissioned/i,
    );
  }
});
