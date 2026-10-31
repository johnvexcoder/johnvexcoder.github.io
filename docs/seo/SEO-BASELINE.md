# Verified baseline — 31 October 2026

## Initial architecture

The owner-selected standalone repository uses Next.js 16.4.0 App Router, React 19, TypeScript, custom CSS, local fonts and native browser motion. `output: export`, `trailingSlash: true` and unoptimized Next image configuration support GitHub Pages. Build-time image variants and explicit dimensions supply static-compatible image delivery. No framework, host or domain migration is necessary.

Existing CI already runs lint, tests, build, SEO validation, export validation, the verification-file byte comparison and .nojekyll check. Metadata, canonical policy, Person/WebSite/ProfilePage/CreativeWork/Service/BreadcrumbList graphs, sitemap, robots and consent-gated GA4 already exist. They were not missing features.

The initial working tree had a modified next-env.d.ts, an untracked local consolidation report and six untracked screenshot directories. Those are preserved. No destructive Git operations, push, deployment or live configuration changes were performed.

## Initial functional / search checks

The initial production export contained 27 content routes (home, services hub, six service details and 19 cases), plus the 404. Existing tests and lint passed. Initial export checks validated 1,058 internal links and 107 schema nodes. All original project identities and public reference links were retained. The verification file and analytics-consent integration are protected by existing tests.

A normal build exposed the pre-existing Next.js security advisory; the compatible Next.js/eslint-config-next patch to 16.4.3 resolved the reported production dependency issue. A separate first attempt in the restricted execution environment could not run a child TypeScript process; running the normal local build resolved that environment limitation. Neither issue was hidden as a successful initial check.

## Production comparison

Read-only public crawling covers every current sitemap route and every intended new local content route. See PRODUCTION-ROUTES.json for URL-by-URL status, title, canonical, robots, H1, links and local-title comparison. All 27 existing production pages return 200; their titles match the initial architecture. The six new case URLs return 404 until approved publication. Production robots and sitemap return 200, `/services` returns 301 to `/services/`, an unknown route returns a genuine 404, and the verification file returns 200.

Production is not synchronized with the new local project content. This is expected because publication is pending. New public pages cannot be declared indexed or remotely validated yet.

## Measurement procedure and limitations

Initial Lighthouse runs used fresh headless Chromium sessions, default mobile simulation and the explicit Lighthouse desktop config. Three runs per device were retained. An early attempt to select desktop using a CLI-style option was found to still use mobile settings; those mislabeled runs are excluded and replaced by verified desktop runs.

Two serving conditions are recorded separately: the existing uncompressed local preview and a gzip-enabled comparison server. The second comparison uses the preserved original export: all 15 referenced script files match the fresh initial baseline's names and byte lengths, and the initial CSS resource is present. Baseline and optimized builds use the same gzip-serving implementation. These are local lab simulations, not a claim about GitHub Pages CDN timing or field experience. Do not compare scores across the two serving conditions as if code alone caused the difference.

See PERFORMANCE-COMPARISON.md and machine-readable evidence for medians, ranges and individual runs. Baseline mobile raw-preview performance is 69–70, accessibility 90, best practices 100 and SEO 100. Desktop raw-preview performance is 94–96, with accessibility 90 and other categories 100. Baseline CLS is 0. INP, real-user p75 values, CrUX and private GSC/GA4 reports are unavailable; TBT is reported only as a lab proxy, never as INP.

## Confirmed priorities

1. Integrate the six verified demonstrations with real images and accurate scope, retaining all original routes.
2. Centralize project/service relationships and make the same preview lifecycle reusable.
3. Patch the known Next.js dependency issue, preserving the static architecture.
4. Correct observed accessibility failures: review-star semantics, fading workflow text, footer link distinction and redundant brand labeling.
5. Reduce measured image transfer costs, preserve first-paint hero content and limit speculative case prefetching.
6. Preserve and extend all-route SEO regression protection; document private-data and publication-dependent work.
