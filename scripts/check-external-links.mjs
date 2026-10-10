import fs from "node:fs/promises";
import { parse } from "parse5";
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const routes = ["/", "/404/", ...projects.map((p) => `/work/${p.id}/`)];
function* walk(node) {
  yield node;
  for (const child of node.childNodes || []) yield* walk(child);
}
const urls = new Set();
for (const route of routes) {
  for (const node of walk(
    parse(await fs.readFile(`out${route}index.html`, "utf8")),
  )) {
    if (node.tagName === "a") {
      const href = node.attrs.find((a) => a.name === "href")?.value;
      if (href?.startsWith("https://")) urls.add(href);
    }
  }
}
const results = [];
let cursor = 0;
async function request(url, method) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop < 8; hop++) {
    if (new URL(current).hostname.endsWith(".ts.net"))
      return {
        method,
        excluded: "Private Tailscale destination; no request performed.",
        chain,
      };
    const response = await fetch(current, {
      method,
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    chain.push({ url: current, status: response.status });
    const next = response.headers.get("location");
    if (![301, 302, 303, 307, 308].includes(response.status) || !next) {
      response.body?.cancel();
      return { method, status: response.status, finalUrl: current, chain };
    }
    response.body?.cancel();
    current = new URL(next, current).href;
    if (!current.startsWith("https://"))
      return { method, excluded: "Non-HTTPS redirect not followed.", chain };
  }
  return { method, error: "Redirect limit reached", chain };
}
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < urls.size) {
      const url = [...urls][cursor++];
      try {
        let result = await request(url, "HEAD");
        if (result.status >= 400) result = await request(url, "GET");
        results.push({
          url,
          ...result,
          assessment: result.excluded
            ? "Excluded"
            : result.status >= 200 && result.status < 400
              ? "Reachable"
              : [401, 403, 429].includes(result.status)
                ? "Access/rate restriction; not proof of a broken destination"
                : "Needs manual verification",
        });
      } catch (error) {
        results.push({
          url,
          error: error.message,
          assessment: "Request failed; needs manual verification",
        });
      }
    }
  }),
);
results.sort((a, b) => a.url.localeCompare(b.url));
await fs.writeFile(
  "docs/SEO-EXTERNAL-LINKS.json",
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      results,
      note: "Read-only public requests. Private destinations excluded; no login, messages or account actions.",
    },
    null,
    2,
  ) + "\n",
);
console.log(`${results.length} unique HTTPS destinations checked.`);
console.log(
  JSON.stringify(
    results.filter((r) => r.assessment !== "Reachable"),
    null,
    2,
  ),
);
