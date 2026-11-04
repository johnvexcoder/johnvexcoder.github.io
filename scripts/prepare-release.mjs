import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
assert.match(sourceCommit, /^[0-9a-f]{40}$/);
if (process.env.GITHUB_SHA)
  assert.equal(
    sourceCommit,
    process.env.GITHUB_SHA,
    "CI must build its checked-out source revision",
  );
const { version } = JSON.parse(await fs.readFile("package.json", "utf8"));
await fs.writeFile(
  "public/release.json",
  JSON.stringify(
    {
      version,
      source_commit: sourceCommit,
      canonical_origin: "https://johnvexcoder.github.io",
    },
    null,
    2,
  ) + "\n",
);
console.log(`Prepared version ${version} from ${sourceCommit}`);
