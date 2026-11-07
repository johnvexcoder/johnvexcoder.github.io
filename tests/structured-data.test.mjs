import test from "node:test";
import assert from "node:assert/strict";
import services from "../content/service-routes.json" with { type: "json" };
import {
  serviceCatalog,
  projectBreadcrumbs,
  serializeJsonLd,
} from "../lib/structured-data.ts";
const origin = "https://johnvexcoder.github.io/";
test("catalog uses authoritative nine routes and existing service identities", () => {
  const c = serviceCatalog(services, origin, "Services and solutions");
  assert.equal(c.numberOfItems, 9);
  assert.equal(c.itemListOrder, "https://schema.org/ItemListUnordered");
  assert.equal(new Set(c.itemListElement.map((i) => i.item["@id"])).size, 9);
  for (const [i, item] of c.itemListElement.entries()) {
    assert.equal(item.name, services[i].name);
    assert.equal(item.url, new URL(services[i].route, origin).href);
    assert.equal(
      item.item["@id"],
      new URL(services[i].route + "#service", origin).href,
    );
  }
  assert.ok(c.itemListElement.every((i) => !i.url.includes("website-care")));
});
test("project breadcrumbs express the real Work collection hierarchy", () => {
  const trail = projectBreadcrumbs("Example project", "/work/example/", origin);
  assert.deepEqual(
    trail.map((i) => i.position),
    [1, 2, 3],
  );
  assert.deepEqual(
    trail.map((i) => i.item),
    [origin, origin + "work/", origin + "work/example/"],
  );
});
test("JSON-LD serialization prevents HTML script termination while preserving data", () => {
  const payload = { name: '</script><script>alert("fixture")</script>' };
  const result = serializeJsonLd(payload);
  assert.ok(!result.includes("<"));
  assert.deepEqual(JSON.parse(result), payload);
  assert.throws(() => serializeJsonLd(undefined), /serializable/);
});
