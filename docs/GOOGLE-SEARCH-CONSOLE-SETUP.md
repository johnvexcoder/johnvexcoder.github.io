# Google Search Console — setup and migration

Prepared 10 October 2026. Owner-confirmed V2 origin: **https://johnvexcoder.github.io/**. Read-only public checks returned HTTP 200 for the existing homepage, robots and sitemap, with the canonical at that origin and GitHub hosting. Those checks observe the currently live site; they do not publish V2 or prove its indexing status.

No authorized Search Console connector/property data is available in this session. No verification, sitemap submission, index request or performance review was performed. Absence of a verification meta tag on the current homepage does **not** prove that no verified property exists: HTML-file or other verification methods may already be in use.

## Verify the right property

1. Open [Google Search Console](https://search.google.com/search-console/) in your own account. Check for an existing property **https://johnvexcoder.github.io/** before creating another.
2. Use a **URL-prefix** property for this GitHub Pages origin. A Domain property for `github.io` is inappropriate because you do not control that parent domain's DNS. If an existing property already grants access, retain it.
3. The owner supplied the official HTML-file verification download. Its exact bytes are installed at `public/google1c03abb64b8da92a.html` and included in the successful static export at `out/google1c03abb64b8da92a.html`. Original: `/home/j0hn/Downloads/google1c03abb64b8da92a.html`. Use this HTML-file method; no additional meta token is required for it. See `GSC-VERIFICATION-REPORT.md` for file-integrity and direct local HTTP evidence.
4. After you approve deployment, check `https://johnvexcoder.github.io/google1c03abb64b8da92a.html` returns the exact original file directly, then press Verify in Search Console yourself. Keep the tag/file available afterwards.

The Metadata API already emits the verification tag when a real token is configured. No password, private credential or analytics identifier is needed by this project. Existing verification files should be preserved during replacement of the public site.

## Approved deployment and sitemap

The source is a static Next.js export. `npm run build` generates `out/`; publish its contents at the domain root only after approval. Keep `_next/`, all `work/` directories, images, robots and sitemap together. `out/.nojekyll` prevents GitHub Pages/Jekyll from dropping underscore-prefixed assets when using branch-based publishing. Use the existing approved Pages setup or an appropriate Pages artifact workflow; no deployment workflow was added or run here.

Build configuration:

```env
NEXT_PUBLIC_SITE_URL=https://johnvexcoder.github.io
SITE_INDEXING=production
```

Exact production sitemap: **https://johnvexcoder.github.io/sitemap.xml**.
Exact robots: **https://johnvexcoder.github.io/robots.txt**.

The production sitemap includes the homepage and 18 public case studies. The custom 404, standalone UI demos, anchor variants, intro replay query, preview and internal routes are excluded. The local build audit cannot substitute for checking public HTTP responses after deployment.

In the verified property, open Sitemaps and submit `sitemap.xml`. Check fetch/read status and any processing errors. Submission is a discovery aid, not an indexing or ranking guarantee.

## URL Inspection checklist

Inspect the eight exact URLs in `SEO-KEYWORD-MAP.md`, beginning with the homepage and Nexora Lab. Check live rendering, indexability, declared versus Google-selected canonical, fetched content and blocked resources. The rendered page should expose name/role, all project names, About, Services, Skills, Experience and Contact without waiting for a scroll or intro completion. Request indexing only for changed public URLs after a successful live test; do not request indexing of `/404/` or demos.

Use [Rich Results Test](https://search.google.com/test/rich-results) for supported ProfilePage/Breadcrumb features and [Schema Markup Validator](https://validator.schema.org/) for general WebSite/Person/CreativeWork vocabulary. The homepage and a representative case were actually tested in Schema Markup Validator with zero errors/warnings; all pages pass local JSON/required-field checks separately. Google Rich Results Test has not been run on the deployed V2 site. Google does not support WebSite site-name markup in Rich Results Test, and valid schema does not guarantee a special search appearance.

## Coexistence and future migration

V2 is intended to replace the existing site **at the same origin**, so no cross-domain redirect is needed now. Preserve the existing public site until deployment approval. Keep existing project paths and public verification files. Compare the old public sitemap and saved source snapshot before replacement; retain a rollback copy. Unknown paths must return a genuine HTTP 404 with the supplied `404.html`, rather than a blanket homepage redirect that creates soft 404s.

For a separate public staging build use `SITE_INDEXING=preview`. It emits noindex and an empty sitemap while allowing crawlers to see the noindex; robots is not used to block the entire preview. Restrict staging access if it must be private. Do not submit that sitemap or claim a temporary preview is the production identity.

If a future owner-approved custom Hostinger domain is chosen, change the one HTTPS root origin, rebuild, verify the new property and validate the new sitemap/canonicals publicly. Use supported permanent redirects on infrastructure you control, preserve per-project paths, and use Search Console's applicable migration tooling. GitHub Pages has no general server-side redirect rules; do not promise nginx-style 301 configuration there. Do not automatically deindex or redirect the old site. [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) and [site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) apply to an approved future migration.
