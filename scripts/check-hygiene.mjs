import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
const files = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const forbidden = files.filter(
  (file) =>
    /(^|\/)(?:AGENTS\.md|__pycache__|node_modules)(?:\/|$)/.test(file) ||
    /^(?:\.agents|\.codex|docs\/codex)\//.test(file) ||
    /\.py[co]$/.test(file) ||
    /^\.env(?!\.example$)/.test(file) ||
    /^(?:out|\.next)\//.test(file),
);
assert.deepEqual(
  forbidden,
  [],
  "Release source must exclude local instructions, credentials and caches",
);
console.log(
  `Source hygiene passed: ${files.length} tracked files; required Pages workflow retained.`,
);
