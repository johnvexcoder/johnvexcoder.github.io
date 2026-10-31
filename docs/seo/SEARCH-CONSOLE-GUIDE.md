# Search Console readiness and monitoring — 31 October 2026

Production origin remains https://johnvexcoder.github.io/. The exact HTML verification file and optional metadata verification are preserved. Analytics still requires consent; this work neither enables tracking nor changes the measurement identifier.

No authenticated Search Console or GA4 reporting connector/export is available. Clicks, impressions, CTR, position, country performance, index coverage and field Core Web Vitals are unavailable. Public HTTP checks and local validation cannot establish whether Google indexed a page.

After approved publication, use the existing verified URL-prefix property. Verify the exact HTML file is publicly reachable, then submit `https://johnvexcoder.github.io/sitemap.xml`. Inspect the six `/work/` routes (bedrock, aurvel, rajt-marine-services, aurevia, voyara, aurelia), the services hub and all six existing service pages. Compare user-declared and Google-selected canonical, fetched HTML, indexing eligibility and sitemap processing. Do not submit standalone demos or the 404 page.

## Reporting procedure

1. In Performance → Search results, retain Web search and compare the last 28 complete days with the preceding period. Also compare three months; use seven days only for early diagnostics, six months and year-over-year when enough history exists.
2. Export Queries, Pages, Countries and Devices separately. Save exports privately outside `public/` and outside any public repository. Exclude incomplete/recent days and record filters, property, timezone and export dates.
3. Separate branded variants (John Angelo De Joya, John De Joya, J0hnvexcoder, johnvexcoder) from nonbranded service searches. Compare Philippines with other countries; impressions alone do not prove qualified leads.
4. Inspect high-impression pages with weak CTR in context of the query and average position. Review declines over comparable complete periods before deciding to rewrite useful content.
5. Review Page indexing, Sitemaps and Core Web Vitals monthly and after publication. A lack of field data means insufficient evidence, not a passing score.
6. Record the observation, affected URL, supporting period, proposed action and follow-up date. Prioritize crawl/indexing failures before snippet refinements.

API access, if later needed, should use the read-only `https://www.googleapis.com/auth/webmasters.readonly` scope and a property permission sufficient to read reports (Restricted user for reporting; owner handles verification and permission management). Never put OAuth secrets or exports in frontend environment variables. A custom dashboard is unnecessary for this portfolio.

Use the live Google Rich Results Test for supported features and Schema.org Validator for general vocabulary after publication. Local JSON-LD checks verify syntax, consistent identity and expected relationships; they are not a remote rich-result eligibility result.
