# SearchEdge — local SEO audit

Prepared 10 October 2026. Intended production origin: https://johnvexcoder.github.io/. V2 is not deployed. Existing live V1 remains in place.

## Findings and completed changes

The saved baseline in `SEO-BASELINE.json` recorded the old homepage title, route payload union and source hashes. Initial gaps addressed: explicit confirmed-origin/preview policies; full-name and role metadata; WebSite schema identity; case Open Graph site-name inheritance; related-case links; smaller responsive alpha portrait files; deferred review-dialog loading; formal lint and exported-HTML audits. Existing centered Hero, cinematic opening, About philosophy, projects, interactions and reference repositories were preserved.

The keyword map prioritizes eight existing useful pages rather than creating thin pages. Titles, descriptions, geography and schema use authentic owner-provided facts. No search volume, ranking, backlink, award or rating metrics are fabricated.

## Validation evidence

- Lint and TypeScript checks passed; 22 tests passed, zero failures.
- Production and preview builds passed. Latest production build additionally includes the official Google verification HTML file.
- 19 indexable content pages; 19 sitemap entries; 746 internal links; 605 valid fragment links; 76 schema nodes checked. Unique metadata, exact canonicals, actual sharing images, initial HTML content and image dimensions passed; advisory list empty.
- XML independently parsed. Preview sitemap is empty and content pages have noindex.
- Homepage and representative Shoes on the Go case validated at Schema Markup Validator: zero errors and zero warnings. Saved validator output is retained. Google Rich Results Test and public URL Inspection remain outstanding after an approved release.
- Export audit passed for 20 application HTML routes and 519 local references. The separate 53-byte Google verification file is included and directly serves HTTP 200 locally with no redirect or JavaScript.
- External check covered 36 unique HTTPS destinations: 33 reachable, LinkedIn and Ko-fi restricted automated requests, one private Tailscale destination excluded. No confirmed broken public link remained; restrictions are not reported as broken links.
- Original reference sources verified unchanged. Google-file preparation additionally compared application/configuration hashes and changed none.

## Performance evidence and limits

Browser-selected portrait at checked desktop/mobile DPR 1: 61,690 bytes versus the retained 538,184-byte original, an 88.5% smaller image download. Higher-density 480/640/960 variants remain. This is an image byte reduction, not proof of improved whole-page Core Web Vitals.

Single cached local development observations: mobile LCP/FCP 604 ms, TTFB 312.4 ms, CLS 0, INP 112 ms; desktop LCP/FCP 656 ms, TTFB 328.7 ms, CLS 0; desktop INP was not captured in saved evidence. `SEO-PERFORMANCE.json` records conditions and limitations. No controlled pre-change baseline, Lighthouse score, production cold-load measurement, physical-device test or field percentile is claimed.

Union of all page-referenced script files: 709,121 raw / 221,829 gzip bytes, versus baseline 707,281 / 220,787. This slightly larger route union is not a single-page download measurement. Normal production does not mount optional Web Vitals diagnostics.

Production dependency audit found zero vulnerabilities at the time checked. Five development-only advisories remain in the official lint configuration dependency chain; no compatible upstream fix was available from the registry then. A forced downgrade was not applied. See saved dependency audit evidence.

## Public verification and next steps

Google verification file is locally ready; downloaded/public/export bytes and SHA-256 match. See `GSC-VERIFICATION-REPORT.md`. No ownership verification, sitemap submission, index request, public deployment, DNS modification or Git push was performed.

After owner-approved deployment: check public file and canonical responses, click VERIFY, submit sitemap.xml, inspect the eight mapped URLs, run applicable Google Rich Results checks, and establish a real Search Console baseline. Monthly report is a template for actual future data, not a claim that scheduled monitoring has occurred. Rankings and indexing cannot be guaranteed.

Implementation: `SEO-IMPLEMENTATION.md`. Intent map: `SEO-KEYWORD-MAP.md`. Owner workflow: `GOOGLE-SEARCH-CONSOLE-SETUP.md`. Maintenance template: `SEO-MONTHLY-REPORT.md`.
