import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import sharp from "sharp";
const read = (name) => JSON.parse(fs.readFileSync(name, "utf8"));
const projects = read("content/projects.json");
const studies = read("content/case-studies.json");
const services = read("content/services.json").pages;
const media = read("content/media.json");
const demos = {
  bedrock: "https://demo-bedrock.vercel.app/",
  aurvel: "https://demo-aurvel.vercel.app/",
  "rajt-marine-services": "https://demo-rajt-marine-services.vercel.app/",
  aurevia: "https://aurevia-xi-ten.vercel.app/",
  voyara: "https://voyara-ruddy.vercel.app/overview",
  aurelia: "https://aurelia-five-teal.vercel.app/",
};
test("six demonstrations have distinct public identities, evidence and bounded claims", () => {
  for (const [id, url] of Object.entries(demos)) {
    const p = projects.find((p) => p.id === id);
    const study = studies.find((s) => s.id === id);
    assert.equal(p.demo, url);
    assert.equal(p.status, "demo");
    assert.equal(p.classification, "Personal project");
    assert.ok(p.disclaimer.length > 100);
    assert.ok(study.decisions.length > 150);
    assert.ok(study.features.length >= 3);
    assert.ok(
      study.related.every(
        (related) => related !== id && projects.some((p) => p.id === related),
      ),
    );
    assert.equal(study.service, p.serviceIds[0]);
  }
});
test("project registry owns valid unique service relationships for every project", () => {
  for (const p of projects) {
    assert.ok(p.serviceIds.length);
    assert.equal(new Set(p.serviceIds).size, p.serviceIds.length);
    assert.ok(p.serviceIds.every((id) => services.some((s) => s.id === id)));
  }
  assert.ok(
    services.every((s) => !("examples" in s)),
    "no second hardcoded relationship list",
  );
});
test("responsive previews decode, reserve matching dimensions and remain distinct", async () => {
  const paths = new Set();
  for (const id of Object.keys(demos)) {
    const p = projects.find((p) => p.id === id);
    assert.ok(!paths.has(p.scrollImage));
    paths.add(p.scrollImage);
    const image = await sharp(`public${p.scrollImage}`).metadata();
    assert.equal(image.format, "webp");
    assert.ok(image.height > image.width, `${id}: full page`);
    assert.equal(image.width, media[p.scrollImage].width);
    assert.equal(image.height, media[p.scrollImage].height);
    for (const source of media[p.scrollImage].sources) {
      const variant = await sharp(`public${source.src}`).metadata();
      assert.equal(variant.width, source.width);
      assert.ok(
        Math.abs(variant.height / variant.width - image.height / image.width) <
          0.003,
      );
    }
  }
});
