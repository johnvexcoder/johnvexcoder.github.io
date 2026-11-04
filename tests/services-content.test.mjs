import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const projects = read("content/projects.json");
const studies = read("content/case-studies.json");
const services = read("content/services.json");
test("every existing project has an evidence-backed case and valid service/related destinations", () => {
  assert.equal(studies.length, projects.length);
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
  assert.equal(new Set(studies.map((s) => s.meta)).size, projects.length);
});
test("ten service routes separate new builds, redesign, content, relationships and operations", () => {
  assert.deepEqual(
    [services.main.route, ...services.pages.map((p) => p.route)],
    [
      "/services/",
      "/services/business-websites/",
      "/services/website-redesign/",
      "/services/technical-seo/",
      "/services/cms-solutions/",
      "/services/crm-development/",
      "/services/admin-dashboard-development/",
      "/services/portfolio-websites/",
      "/services/booking-systems/",
      "/services/custom-solutions/",
    ],
  );
  for (const service of services.pages) {
    assert.ok(service.faq.length >= 2);
    assert.ok(service.scope.length >= 4);
    assert.ok(service.distinctSection.length > 150);
    for (const id of projects
      .filter((p) => p.serviceIds.includes(service.id))
      .map((p) => p.id))
      assert.ok(projects.some((p) => p.id === id));
  }
  assert.deepEqual(
    projects
      .filter((p) => p.serviceIds.includes("booking-systems"))
      .map((p) => p.id),
    ["taitechmarine", "bedrock", "aurevia", "voyara", "aurelia"],
  );
  assert.equal(new Set(services.pages.map((p) => p.description)).size, 9);
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

test("service names stay consistent across page, homepage and inquiry catalogs", async () => {
  const routeCatalog = read("content/service-routes.json");
  const { inquiryServices } = await import("../lib/inquiry.ts");
  for (const page of services.pages) {
    const route = routeCatalog.find((s) => s.id === page.id);
    assert.equal(route.name, page.name);
    assert.equal(route.summary, page.summary);
    assert.equal(route.title, page.title);
  }
  for (const id of [
    "cms-solutions",
    "technical-seo",
    "booking-systems",
    "crm-development",
    "admin-dashboard-development",
  ])
    assert.equal(
      inquiryServices.find((s) => s.id === id).name,
      services.pages.find((s) => s.id === id).name,
    );
  assert.equal(
    services.pages.find((s) => s.id === "cms-solutions").name,
    "Custom CMS Development",
  );
});

test("curated service evidence has unique valid projects and agrees with reverse case-study links", () => {
  for (const service of services.pages) {
    assert.equal(
      new Set(service.selectedProjects).size,
      service.selectedProjects.length,
    );
    for (const id of service.selectedProjects) {
      const project = projects.find((p) => p.id === id);
      assert.ok(project, id);
      assert.ok(
        project.serviceIds.includes(service.id),
        `${id} must link back to ${service.id}`,
      );
    }
  }
  const atlas = projects.find((p) => p.id === "atlas-enterprise");
  assert.ok(!atlas.serviceIds.includes("technical-seo"));
  assert.ok(!atlas.serviceIds.includes("website-redesign"));
});

test("Atlas remains a fictional local demonstration with real responsive screenshot assets", async () => {
  const atlas = projects.find((p) => p.id === "atlas-enterprise");
  const study = studies.find((s) => s.id === atlas.id);
  assert.equal(atlas.classification, "Personal project");
  assert.equal(atlas.demo, "https://atlas-enterprise-one.vercel.app/");
  assert.equal(atlas.github, null);
  assert.match(study.tradeoff, /fictional/);
  assert.match(study.tradeoff, /server-side authorization/);
  assert.ok(atlas.technologies.includes("IndexedDB"));
  for (const planned of ["Dexie", "Tailwind CSS"])
    assert.ok(!atlas.technologies.includes(planned));
  assert.equal(study.gallery.length, 3);
  const sharp = (await import("sharp")).default;
  for (const view of study.gallery) {
    const dimensions = await sharp("public" + view.image).metadata();
    assert.equal(view.width, dimensions.width);
    assert.equal(view.height, dimensions.height);
    for (const source of view.sources)
      assert.ok(fs.existsSync("public" + source.src));
  }
});
