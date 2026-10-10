import fs from "node:fs/promises";
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const urls = [
  ...new Set(
    projects
      .flatMap((p) => [p.demo, p.github, p.docs, p.release])
      .filter((u) => u?.startsWith("https://") && !u.includes(".ts.net")),
  ),
];
const results = [];
let index = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (index < urls.length) {
      const url = urls[index++];
      try {
        const response = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(15000),
        });
        results.push({ url, status: response.status, finalUrl: response.url });
      } catch (error) {
        results.push({ url, error: error.message });
      }
    }
  }),
);
results.sort((a, b) => a.url.localeCompare(b.url));
await fs.writeFile(
  "docs/LINK-CHECKS.json",
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      results,
      excluded:
        "MovieFlix private Tailscale destination; no private-network probe.",
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    results.filter((r) => r.status !== 200),
    null,
    2,
  ),
);
console.log(`${results.length} public project links checked.`);
