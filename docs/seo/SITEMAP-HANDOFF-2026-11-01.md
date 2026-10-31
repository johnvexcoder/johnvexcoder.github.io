# Sitemap investigation and Search Console handoff — 1 November 2026

The pre-change public sitemap returned 200 with `Content-Type: application/xml`, parsed with the standard namespace and 33 canonical URLs, and exactly matched the preserved static export SHA-256. All 33 existing pages were publicly reachable in the bounded read-only crawl. Robots returned 200 and referenced the correct sitemap. Services without its final slash redirected; an unknown URL returned a real 404. About, Works and Contact were absent before this change and returned 404, as expected.

These observations do not establish the cause of the owner's October 31 Couldn't fetch / Type Unknown / blank Last read / zero Discovered pages report. The historical performance export contains no sitemap error detail. No authenticated current Search Console view was obtained. Do not describe this as a confirmed Google-side fix or successful sitemap processing.

The existing generator is appropriate; it is retained and extended for the three real new routes. The resulting intended inventory is 36 canonical HTML pages. Images stay annotated where already supported. Modification dates are omitted unless genuine page-specific dates exist. Markdown mirrors, llms.txt, error pages and demos are excluded.

After deployment:

1. Open the verified URL-prefix property `https://johnvexcoder.github.io/` (or the correctly scoped verified property), not an HTTP or different-host prefix. Preserve the existing verification file.
2. Open Sitemaps and click the exact submitted entry. Record its full submitted URL, last attempt/read date and detailed error. Expand any fetch/parser details; a screenshot of the summary alone does not establish the cause.
3. Fetch `https://johnvexcoder.github.io/sitemap.xml` without authentication. Confirm status, XML content type, correct root namespace, 36 absolute HTTPS canonical HTML URLs, no duplicates and no HTML error document. Compare the downloaded bytes with the deployed artifact.
4. Use Live URL Inspection where applicable and review Google's fetch/crawl response and user-declared vs Google-selected canonical for the homepage, the three new pages and a representative service/case. Do not assume a spoofed Googlebot request proves Google access.
5. If an actual defect is present, fix and validate it. Submit/resubmit the exact sitemap URL through the verified property after the correct artifact is live. Use Google's report detail to decide whether to wait for the next scheduled retry; avoid repeated blind submissions.
6. Revisit the Sitemaps report and record processing success only when Google reports it. Sitemap acceptance does not guarantee every URL is indexed. Review page-indexing reasons, canonical selection and complete country/device/query/page periods over time.

Hosting remains GitHub Pages. No DNS migration, arbitrary security-header promise, Search Console account/OAuth change or paid SEO provider is part of this implementation.
