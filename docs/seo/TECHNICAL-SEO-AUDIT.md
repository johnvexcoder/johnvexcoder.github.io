# Technical SEO audit — 31 October 2026

## Scope and evidence

Production origin: https://johnvexcoder.github.io/. All 27 current production content routes and six new unpublished routes were requested directly; per-route results are in PRODUCTION-ROUTES.json. All 33 intended local content routes, the 404, internal links, image references, sitemap and JSON-LD were evaluated from exported HTML. About, experience, projects, infrastructure and contact are homepage sections, not missing standalone routes.

| Finding | Affected URLs / evidence | Priority | Implementation | Verification |
| --- | --- | --- | --- | --- |
| Six supplied projects absent from the registry/case export | `/work/bedrock/`, `/work/aurvel/`, `/work/rajt-marine-services/`, `/work/aurevia/`, `/work/voyara/`, `/work/aurelia/`; public 404 before publication | High product/discovery gap; not an existing-site indexing outage | Added unique case content, genuine WebP previews, related services/work, contact CTA, distinct metadata and graph relationships | All six statically exported and browser checked; public availability requires the authorized publication |
| Service example associations maintained in a separate list | Existing service pages and case navigation | Medium, confirmed source maintenance risk | Project registry owns serviceIds; selectors derive service examples; every associated service linked from its case | Registry tests and expanded all-route link checks pass |
| Large full-page screenshot payloads | Six supplied original PNGs plus older single-width long previews | Medium, high confidence | Dedicated optimized WebP + measured responsive candidates; lazy loading and stable frames | Decoder/dimension/srcset checks and actual preview browser tests pass; originals preserved |
| Oversized transparent portrait variants | Homepage, especially 640px mobile candidate | High loading opportunity | Quality-86 WebP with full-quality alpha; preserve 960px source and original PNG | 640px variant reduced from about 230KB to 40KB; transparency/dimensions verified |
| Unused font coverage in critical requests | Homepage and shared layout | Medium, measured transfer cost | FontTools subsets retain available characters required by source plus broad Latin/punctuation coverage; fonts keep the same design and metrics | All covered source glyphs asserted; original fonts and licenses retained; smaller files preload with swap |
| First-visit identity delayed by intro | Homepage hero | Medium user experience | Main identity, portrait and actions appear immediately with short entrances; existing network story preserved | Responsive screenshots, reduced-motion and navigation checks pass |
| Repeated preview scroll writes | Projects and service examples | Medium rendering risk, confirmed implementation | Visibility-aware transform animation with proportional timing and manual position transfer | All six new previews run; explicit/manual/reduced-motion controls tested |
| Accessibility failures in initial lab audit | Homepage review stars, brand, workflow labels, footer links | High usability, high confidence | Valid star-image semantics, native visible brand label, static readable workflow text, underlined footer links | All 33 dark-theme pages report zero axe violations; light-theme representative checks also pass after token/filter correction |
| Light-theme muted/active-filter contrast | Shared light theme | High usability, confirmed browser audit | Darker muted token and white text on selected filter | Homepage, business service and Bedrock case rechecked with zero axe violations |
| Speculative case-route downloads | Collection and related-case/service links | Medium resource opportunity | Disable Next Link prefetch where case content is only needed on navigation | Crawlable anchors retained; navigation/history checks pass |
| Existing Next.js version flagged by registry | Build dependency, Next.js 16.4.0 | High dependency maintenance | Compatible Next.js/eslint-config-next 16.4.3 patch; transitive development Zod patch | Production audit reports zero known vulnerabilities; tests/build pass; development-only moderate advisories remain separately documented |
| Apple touch icon and conventional favicon fallback absent | Shared branding metadata | Low | Derive 180px Apple and 32px ICO assets from the existing brand SVG and register the Apple icon | Export decoder/dimension check passes |

## Existing protections verified and retained

The initial site already had self-referencing canonical URLs, distinct page metadata, static rendering, sitemap, robots, meaningful project cases, Google verification and consent-gated analytics. No critical production indexing blockade was found. Existing production pages returned 200 with useful H1/title/canonical content; all retained routes remain exported. The six new URLs' production 404s are expected until publication.

Local checks verify unique titles/descriptions, one primary H1, main landmarks, canonical placement in the document head, confirmed origin/trailing-slash policy, OG/Twitter images and descriptions, sitemap/canonical agreement, no accidental production noindex, image alt/dimensions/candidate widths, links/fragments, service relationships and graph syntax/identity. The error route remains noindex and excluded from the sitemap. Standalone demos and intro-query variants are not sitemap entries.

Actual public HTTP checks show `/services` → `/services/` with status 301, an unknown route returns 404, the query variant returns 200 and the verification file returns 200. GitHub Pages does not provide arbitrary server rules; no client-side navigation was misreported as a permanent redirect. Query variants retain the homepage canonical policy. No deep links or existing route paths were removed.

## Schema and entity integrity

Person, WebSite, ProfilePage/WebPage, Service, CreativeWork and BreadcrumbList remain grounded in visible content. The aliases John Angelo De Joya, John De Joya, J0hnvexcoder and johnvexcoder share the existing professional identity and verified profile destinations. New demonstrations do not become client work, live transactional businesses or fabricated case-study results. There are no invented reviews, ratings, offices, business hours or guaranteed rich results. JSON syntax, expected graph shapes, origin and identity references are checked locally; public Google eligibility and external validator results for new pages remain post-publication work.

## International and AI readiness

The site retains truthful Bulacan/Philippines positioning and welcomes remote enquiries. Existing service routes cover distinct supported intent; no thin country/city pages or invented hreflang alternatives are created. Useful initial HTML, actual work, clear authorship and linked service evidence support discoverability. The explicitly requested llms.txt is a public link directory, not a claim of Google/AI ranking benefit. See KEYWORD-STRATEGY.md.

## Limitations and remaining work

No authenticated Search Console/GA4 report, field INP/CrUX dataset, physical-device frame trace or external rich-result result for unpublished pages was obtained. Automatic accessibility checks do not establish complete WCAG conformance. GitHub Pages HTTP/cache behavior after publication still needs owner-authorized live verification. See PERFORMANCE-COMPARISON.md, SEARCH-CONSOLE-GUIDE.md and IMPLEMENTATION-REPORT.md for exact measurements and outstanding actions.

Primary guidance: [Google canonical policy](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [AI features](https://developers.google.com/search/docs/appearance/ai-features), [web.dev LCP](https://web.dev/articles/optimize-lcp), [Schema.org CreativeWork](https://schema.org/CreativeWork), and [Next.js security patch](https://nextjs.org/blog/nextjs-security-update-october-14-2026).
