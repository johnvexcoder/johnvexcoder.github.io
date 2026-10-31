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
