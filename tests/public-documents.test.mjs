import test from "node:test";
import assert from "node:assert/strict";
import { publicDocuments, llmsDirectory } from "../lib/public-documents.ts";
import { publicPages } from "../lib/public-pages.ts";
test("all 40 canonical HTML pages have one shared-source Markdown mirror", () => {
  const docs = publicDocuments();
  assert.equal(docs.length, 40);
  assert.equal(new Set(docs.map((d) => d.route)).size, 40);
  assert.equal(new Set(docs.map((d) => d.markdownPath)).size, 40);
  for (const doc of docs) {
    assert.ok(doc.markdown.startsWith("# "));
    assert.ok(
      doc.markdown.includes(
        `Canonical HTML: https://johnvexcoder.github.io${doc.route}`,
      ),
    );
    assert.ok(!doc.markdown.includes("[object Object]"));
  }
  for (const route of ["/about/", "/work/", "/contact/"])
    assert.ok(docs.find((d) => d.route === route));
});
test("llms directory links only to the real canonical and Markdown document registries", () => {
  const docs = publicDocuments();
  const valid = new Set(docs.flatMap((d) => [d.route, d.markdownPath]));
  const links = [
    ...llmsDirectory().matchAll(
      /\]\((https:\/\/johnvexcoder.github.io[^)]+)\)/g,
    ),
  ].map((m) => new URL(m[1]).pathname);
  assert.ok(links.length >= 72);
  for (const path of links) assert.ok(valid.has(path), path);
  assert.ok(
    publicPages.find((p) => p.route === "/").description.includes("remote"),
  );
});
