# SearchEdge — reusable monthly report

This is a template for the ₱5,000/month SearchEdge scope, not a completed recurring report. The initial implementation was performed locally on 10 October 2026. No monthly optimization, automated monitoring, Search Console access or search-performance result is claimed.

## Review identity

- Reporting month / reviewer: [fill after an actual review]
- Production origin: https://johnvexcoder.github.io/
- Verified Search Console property / access level: [record actual property]
- Comparison periods, time zone and filters: [equal periods; Philippines/device/query filters as appropriate]
- Public deployment version/date: [verified release]
- Evidence exports/screenshots and collection dates: [links]

## Search performance — actual data only

| Measure | Current period | Comparable prior period | Difference / interpretation |
| --- | --- | --- | --- |
| Clicks | Not collected | Not collected | Await verified Search Console data |
| Impressions | Not collected | Not collected | Await verified Search Console data |
| CTR | Not collected | Not collected | Calculate from actual exports |
| Average position | Not collected | Not collected | Aggregate query position, not a guaranteed individual rank |
| Branded / non-branded queries | Not collected | Not collected | Record definitions and evidence |
| Mobile / desktop and PH filters | Not collected | Not collected | Record filters; do not combine incompatible periods |

Do not replace “Not collected” with zero. Account for incomplete recent dates, seasonality, small samples and query anonymization. A change in position alone does not prove implementation causality.

## Priority mapping changes

Review the eight URLs in `SEO-KEYWORD-MAP.md`. For each changed intent/term, record the actual query evidence, useful content change, responsible URL and before/after metadata. Homepage anchors remain sections of one page; do not invent independent About/Services URLs or thin keyword pages.

## Indexation, crawling and canonical review

| URL / issue | Actual Search Console status | Declared vs selected canonical | Last crawl / evidence | Action / owner | Verification |
| --- | --- | --- | --- | --- | --- |
| [real URL] | [indexed/excluded/error] | [actual values] | [actual data] | [specific fix or no action] | [result/date] |

Review sitemap fetch/status, discovered and indexed content URLs, unexpected noindex, soft 404s, redirects, blocked resources and duplicates. Intentional noindex on 404/demos/previews is not a defect. Do not report sitemap entry counts as indexed-URL counts.

## Technical checks

Run from the current source after a production build:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run check:seo
npm run check:export
node scripts/check-links.mjs
```

Record real missing/duplicate titles or descriptions, incorrect canonicals, broken anchors/routes, public external-link status, schema findings, image/social-preview errors and layout regressions. A public 403/429 may be bot/rate protection: verify before declaring a link broken. Never probe the private MovieFlix Tailscale destination.

For performance, record actual production Lighthouse test settings and repeated results, PageSpeed/CrUX availability, LCP/INP/CLS at the 75th percentile when field data exists, device/network conditions and intro state. Local debug console metrics are single lab observations, not field Core Web Vitals. Preserve the cinematic intro, interactions and reduced-motion handling.

## Work completed this month

- [Observed problem → exact code/content change → verification evidence]
- [Unresolved dependency → accountable owner → next action]

## Next priorities within SearchEdge

- [Evidence-led metadata/content/internal-link recommendation]
- [Search Console issue requiring review]
- [Retest after an approved change]

No backlink purchases, advertising, directory spam, fabricated reviews/business listings or TechnicalFlow expansion are included. Each month needs a fresh review and real data. This template does not schedule an automation or claim monitoring has occurred.
