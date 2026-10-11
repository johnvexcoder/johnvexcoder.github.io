import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";
import { parse } from "parse5";
import { resolveSiteOrigin, resolveIndexing } from "../lib/seo-policy.ts";

const origin = resolveSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL);
const indexable = resolveIndexing(process.env.SITE_INDEXING);
const projects = JSON.parse(await fs.readFile("content/projects.json", "utf8"));
const routes = ["/", ...projects.map((p) => `/work/${p.id}/`)];
const absolute = (value) => new URL(value, origin).href;
const attributes = (node) =>
  Object.fromEntries((node.attrs || []).map((a) => [a.name, a.value]));
const walk = function* (node) {
  yield node;
  for (const child of node.childNodes || []) yield* walk(child);
};
const text = (node) =>
  [...walk(node)]
    .filter((n) => n.nodeName === "#text")
    .map((n) => n.value)
    .join("");
const pages = new Map();
for (const route of [...routes, "/404/"]) {
  const html = await fs.readFile(`out${route}index.html`, "utf8");
  const nodes = [...walk(parse(html))];
  pages.set(route, {
    html,
    nodes,
    ids: new Set(nodes.map((n) => attributes(n).id).filter(Boolean)),
  });
}
const titles = new Set(),
  descriptions = new Set(),
  canonicals = new Set();
const checks = [],
  advisory = [];
let internalLinks = 0,
  fragments = 0,
  imageCount = 0,
  schemaCount = 0;
for (const [route, { nodes, ids }] of pages) {
  const meta = (key) =>
    nodes
      .filter((n) => n.tagName === "meta")
      .map(attributes)
      .find((a) => a.name === key || a.property === key)?.content;
  const canonicalTags = nodes.filter(
    (n) => n.tagName === "link" && attributes(n).rel === "canonical",
  );
  assert.equal(canonicalTags.length, 1, `${route}: one canonical`);
  const canonical = attributes(canonicalTags[0]).href;
  assert.equal(
    canonical,
    absolute(route),
    `${route}: exact confirmed canonical`,
  );
  assert.ok(!canonicals.has(canonical), `${route}: duplicate canonical`);
  canonicals.add(canonical);
  const title = text(nodes.find((n) => n.tagName === "title"));
  const description = meta("description");
  assert.equal(meta("keywords"), undefined, `${route}: no meta keywords`);
  assert.equal(
    nodes.filter((n) => n.tagName === "main").length,
    1,
    `${route}: one main landmark`,
  );
  assert.ok(title && description, `${route}: title/description`);
  assert.equal(
    nodes.filter((n) => n.tagName === "h1").length,
    1,
    `${route}: one h1`,
  );
  assert.match(meta("viewport"), /width=device-width.*initial-scale=1/);
  const isError = route === "/404/";
  assert.equal(
    (meta("robots") || "").includes("noindex"),
    isError || !indexable,
  );
  assert.ok(!titles.has(title), `${route}: duplicate title`);
  titles.add(title);
  assert.ok(!descriptions.has(description), `${route}: duplicate description`);
  descriptions.add(description);
  if (title.length > 75)
    advisory.push({
      route,
      field: "title",
      length: title.length,
      note: "Possible display truncation; no universal fixed character limit.",
    });
  if (description.length > 180)
    advisory.push({
      route,
      field: "description",
      length: description.length,
      note: "May be shortened or rewritten by search engines.",
    });
  let image;
  if (!isError) {
    assert.equal(meta("og:url"), canonical);
    assert.equal(meta("og:description"), description);
    assert.equal(meta("twitter:description"), description);
    assert.ok(meta("og:title")?.includes("J0hnvexcoder"));
    assert.equal(meta("og:site_name"), "J0hnvexcoder");
    image = meta("og:image");
    assert.equal(new URL(image).origin, origin);
    assert.ok(meta("og:image:alt"));
    assert.equal(meta("og:image:width"), "1200");
    assert.equal(meta("og:image:height"), "630");
    assert.equal(meta("twitter:card"), "summary_large_image");
    assert.equal(meta("twitter:image"), image);
    const dimensions = await sharp(`out${new URL(image).pathname}`).metadata();
    assert.equal(dimensions.width, 1200);
    assert.equal(dimensions.height, 630);
  }
  const structured = nodes
    .filter(
      (n) =>
        n.tagName === "script" && attributes(n).type === "application/ld+json",
    )
    .map((n) => JSON.parse(text(n)));
  const graph = structured.flatMap((n) => n["@graph"] || [n]);
  schemaCount += graph.length;
  const person = graph.find((n) => n["@type"] === "Person");
  assert.equal(person?.name, "John Angelo De Joya");
  assert.deepEqual(person?.alternateName, [
    "J0hnvexcoder",
    "johnvexcoder",
    "John De Joya",
  ]);
  assert.equal(person.url, origin);
  assert.equal(person["@id"], absolute("/#person"));
  assert.ok(person.sameAs.includes("https://github.com/johnvexcoder"));
  assert.ok(
    person.sameAs.includes("https://www.linkedin.com/in/johnvexcoder/"),
  );
  assert.equal(person.homeLocation.name, "Bulacan, Philippines");
  for (const schema of structured)
    assert.equal(schema["@context"], "https://schema.org");
  for (const item of graph) {
    assert.ok(item["@type"]);
    for (const key of ["@id", "url"])
      if (item[key]) assert.equal(new URL(item[key]).origin, origin);
    assert.ok(
      !item.aggregateRating && !item.award,
      `${route}: no invented ratings/awards`,
    );
  }
  if (route === "/") {
    const website = graph.find((n) => n["@type"] === "WebSite");
    assert.equal(website?.name, "J0hnvexcoder");
    assert.equal(website?.url, canonical);
    const profile = graph.find((n) => n["@type"] === "ProfilePage");
    assert.equal(profile?.mainEntity["@id"], absolute("/#person"));
    assert.ok(
      text(nodes.find((n) => attributes(n).id === "about")).includes(
        "I don't just fix what's broken. I build what lasts.",
      ),
    );
    assert.ok(
      !text(nodes.find((n) => attributes(n).id === "home")).includes(
        "I don't just fix",
      ),
    );
    for (const id of [
      "home",
      "about",
      "projects",
      "services",
      "skills",
      "experience",
      "contact",
      "homelab",
      "system",
      "testimonials",
    ])
      assert.ok(ids.has(id), id);
    const aboutText = text(nodes.find((n) => attributes(n).id === "about"));
    for (const alias of [
      "J0hnvexcoder",
      "johnvexcoder",
      "John Angelo De Joya",
      "John De Joya",
    ]) {
      assert.ok(aboutText.includes(alias), `${alias}: visible identity`);
    }
    const introduction = text(
      nodes.find((n) => attributes(n).id === "introduction"),
    );
    assert.ok(introduction.includes("freelance web developer in Bulacan"));
    assert.ok(introduction.includes("web development in the Philippines"));
    for (const p of projects) {
      assert.ok(
        text(nodes.find((n) => attributes(n).id === "projects")).includes(
          p.name,
        ),
        `${p.name}: initial HTML`,
      );
      assert.ok(
        nodes.some(
          (n) => n.tagName === "a" && attributes(n).href === `/work/${p.id}/`,
        ),
        `${p.id}: crawlable case link`,
      );
    }
    assert.ok(
      text(nodes.find((n) => attributes(n).id === "introduction")).includes(
        "Bulacan, Philippines",
      ),
    );
    assert.equal(
      nodes.filter((n) => attributes(n).class?.includes("skill-icon")).length,
      28,
    );
    const aboutImage = nodes.find(
      (n) =>
        n.tagName === "img" &&
        attributes(n).src === "/source/me/john_aboutme.webp",
    );
    assert.equal(attributes(aboutImage).loading, "lazy");
    assert.equal(attributes(aboutImage).decoding, "async");
    assert.ok(
      attributes(aboutImage).srcset.includes("john_aboutme-480.webp 480w"),
    );
    assert.ok(
      attributes(aboutImage).srcset.includes("john_aboutme-768.webp 768w"),
    );
    for (const width of [480, 768]) {
      const file = `out/source/me/john_aboutme-${width}.webp`;
      const dimensions = await sharp(file).metadata();
      assert.equal(dimensions.width, width);
      assert.equal(dimensions.height / dimensions.width, 1.25);
      assert.ok(
        (await fs.stat(file)).size <
          (await fs.stat("out/source/me/john_aboutme.webp")).size,
      );
    }
    const heroImage = nodes.find(
      (n) =>
        n.tagName === "img" && attributes(n).src === "/source/me/portrait.webp",
    );
    assert.equal(attributes(heroImage).loading, "eager");
    assert.equal(attributes(heroImage).fetchpriority, "high");
    assert.ok(attributes(heroImage).srcset.includes("portrait-320.webp"));
  } else if (!isError) {
    const project = projects.find((p) => route === `/work/${p.id}/`);
    if (project.image) {
      const preview = nodes.find(
        (n) =>
          n.tagName === "img" &&
          attributes(n).src === (project.scrollImage || project.image),
      );
      assert.equal(attributes(preview).loading, "eager");
      assert.equal(attributes(preview).fetchpriority, "high");
    }
    const work = graph.find((n) => n["@type"] === "CreativeWork");
    assert.equal(work?.name, project.name);
    assert.equal(work?.description, project.description);
    assert.deepEqual(
      work.about.map((n) => n.name),
      project.technologies,
    );
    assert.equal(work?.creator["@id"], absolute("/#person"));
    const breadcrumb = graph.find((n) => n["@type"] === "BreadcrumbList");
    assert.deepEqual(
      breadcrumb.itemListElement.map((n) => n.position),
      [1, 2],
    );
    assert.equal(breadcrumb.itemListElement[0].item, absolute("/"));
    assert.equal(breadcrumb.itemListElement[1].item, canonical);
    assert.ok(
      nodes.some((n) => attributes(n)["aria-label"] === "Related work"),
    );
  }
  for (const node of nodes.filter((n) => n.tagName === "a")) {
    const href = attributes(node).href;
    if (!href) continue;
    const target = new URL(href, canonical);
    if (target.origin !== origin) continue;
    if (target.hash && pages.has(target.pathname)) {
      assert.ok(
        pages
          .get(target.pathname)
          .ids.has(decodeURIComponent(target.hash.slice(1))),
        `${route}: missing ${href}`,
      );
      fragments++;
    }
    if (pages.has(target.pathname)) internalLinks++;
    else {
      const file = path.join(
        "out",
        decodeURIComponent(target.pathname),
        target.pathname.endsWith("/") ? "index.html" : "",
      );
      assert.ok(
        await fs.stat(file).catch(() => false),
        `${route}: broken internal ${href}`,
      );
      internalLinks++;
    }
  }
  for (const node of nodes.filter((n) => n.tagName === "img")) {
    const attrs = attributes(node);
    imageCount++;
    assert.ok("alt" in attrs, `${route}: image without alt`);
    assert.ok(
      Number(attrs.width) > 0 && Number(attrs.height) > 0,
      `${route}: image dimensions`,
    );
  }
  checks.push({
    route,
    title,
    description,
    canonical,
    image,
    indexable: !isError && indexable,
  });
}
const sitemap = await fs.readFile("out/sitemap.xml", "utf8");
const sitemapUrls = [...sitemap.matchAll(/(?<!image:)<loc>(.*?)<\/loc>/g)].map(
  (m) => m[1],
);
assert.deepEqual(sitemapUrls, indexable ? routes.map(absolute) : []);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length);
assert.ok(
  !sitemap.includes("/404/") &&
    !sitemap.includes("/demos/") &&
    !sitemap.includes("preview-intro"),
);
const robots = await fs.readFile("out/robots.txt", "utf8");
assert.match(robots, /User-Agent: \*/i);
assert.match(robots, /Allow: \//i);
assert.ok(!/^Disallow:\s*\/$/im.test(robots));
assert.equal(
  robots.includes(`Sitemap: ${absolute("/sitemap.xml")}`),
  indexable,
);
assert.ok((await fs.readFile("out/404.html", "utf8")).includes("noindex"));
await fs.access("out/.nojekyll");
const result = {
  checkedAt: new Date().toISOString(),
  origin,
  indexingMode: indexable ? "production" : "preview",
  pages: routes.length,
  sitemapUrls: sitemapUrls.length,
  imageSitemap: indexable,
  internalLinks,
  fragments,
  imageCount,
  schemaCount,
  checks,
  advisory,
  note: "Local initial HTML, images, links and schema shape checks. Not external Rich Results validation or evidence of Google indexing/ranking.",
};
await fs.writeFile(
  "docs/SEO-CHECKS.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(
  `SEO passed: ${routes.length} content pages, ${internalLinks} internal links, ${fragments} fragments, ${schemaCount} schema nodes; ${indexable ? "production" : "preview"} indexing policy.`,
);
