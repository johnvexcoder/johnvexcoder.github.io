# SearchEdge — initial implementation

Completed locally for `/home/j0hn/Projects/My-Portfolio-v2`, 10 October 2026. This implements initial SearchEdge setup; it does not claim recurring monthly work, indexation, rankings, or a deployed release.

## Identity and production configuration

The owner confirmed `https://johnvexcoder.github.io/` as V2's intended origin and explicitly retained the philosophy in **About**. Name/brand/professional profiles match the original portfolio. Bulacan is supplied by the owner's brief and now appears naturally in Introduction/About. The Hero keeps its existing creative h1, centered portrait, oversized branding, cinematic intro and full-screen composition.

`lib/seo-policy.ts` validates a single HTTPS root origin. Paths, ports, queries, fragments, credentials and localhost values fail rather than silently producing wrong canonicals. `lib/seo.ts` uses that origin for metadata, schema, robots and sitemap. No Vercel preview hostname or local port is inferred as a public identity.

`SITE_INDEXING=production` is the normal build. An explicitly configured `preview` build emits noindex on content pages and an empty sitemap; robots still permits crawling so the noindex can be seen. Both modes were built and audited. The final `out/` is the production-mode export. `.env.example` documents both policies.

## Pages, metadata and schema

- All **19 indexable content pages** have unique descriptive titles/descriptions and exact self-canonicals; eight are mapped for priority reporting. Existing case facts/summaries remain untouched.
- Homepage metadata now uses the full verified name, brand and web-developer role; description adds the truthful location and actual specialties. Open Graph/Twitter descriptions are consistent with page descriptions.
- All 18 case titles distinguish the kind of original work. Case Open Graph explicitly includes `siteName`/locale because a route's Open Graph object replaces, rather than deeply merges, the layout's object.
- Existing real 1200×630 portrait/project sharing images remain. No invented portfolio/client imagery was added. Viewport metadata is explicit and permits normal scaling.
- Person includes truthful role descriptions and a Place named Bulacan, Philippines, not a business/street address. Authentic sameAs links remain.
- Homepage **WebSite** markup was added with consistent brand/alternate name and author. Existing **ProfilePage** links the visible person and site identity. A personal developer About page is an appropriate ProfilePage use case under Google's guidelines; eligibility does not guarantee appearance.
- Case **WebPage / CreativeWork / BreadcrumbList** graphs now connect page, work, creator, site and breadcrumb identities. The technical toolkit becomes `about` Thing entries from actual source technologies. No unsupported SoftwareSourceCode properties, ratings, awards or employment claims were fabricated.
- JSON is safely escaped for inline script output. Initial exported HTML contains metadata, schema, public contact links, projects, skills, services, About and Experience before any intro completion or interaction.
- General vocabulary was actually tested at **validator.schema.org** using code snippets from the generated homepage and Shoes on the Go case: **0 errors and 0 warnings**. All pages also pass local JSON/required-property/link checks. Google Rich Results and URL Inspection remain post-deployment manual checks.

## Navigation and indexing

Every case now offers three related-work links ranked by shared category/recorded technologies and a descriptive Services link. Existing project filters, disclosure rows, screenshot previews, previous/next pagination and initial HTML links remain intact. No thin About, Services or Contact pages were created.

The sitemap contains only the homepage plus 18 public case studies, with actual image URLs where available. It excludes 404, demos, anchors, intro replay and preview/test routes. Robots allows production crawling and declares the exact sitemap origin. Custom 404/fallback remain noindex. The two copied browser-only UI demos are now noindex/follow; their indexable explanatory case studies remain available. Both reference repositories remain unchanged.

`public/.nojekyll` is exported for safe GitHub Pages static asset delivery. No Pages workflow, public deployment, DNS change, automatic redirect, old-site deindexing or remote Git action was performed.

## Image and performance work

Three lossless alpha WebP portrait variants (320/480/640px) support native srcset/sizes. The existing 960px original is retained for high-density displays. Eager loading, high fetch priority and exact intrinsic dimensions reserve the same portrait space; the image-bound fade is unchanged. This static-export native image avoids an unnecessary image server or a duplicate fallback preload.

At the checked desktop/mobile DPR-1 viewports, the browser selects the 320px file: **61,690 bytes versus 538,184 bytes**, an **88.5% smaller selected portrait file**. The 480px file is 136,892 bytes and 640px is 229,568 bytes. This is a measured image-byte reduction, not a claimed Core Web Vitals improvement or whole-page reduction. Screenshot quality/auto-scrolling are preserved; their alt text now describes actual project content. Below-fold photography and screenshots stay lazy with dimensions.

The review dialog's code is deferred until the existing Leave a Review button is used. Reviews themselves remain in the initial HTML. Opening/closing was exercised without submitting a review or solving CAPTCHA. No carousel/play/pause controls were introduced.

`components/WebVitals.tsx` provides document-scoped local-console diagnostics using Google's `web-vitals` library. Enabled in development or explicitly with `NEXT_PUBLIC_PERFORMANCE_DEBUG=true`; normal production does not mount diagnostics. It sends no analytics request, cookies or user data. Measurements are lab observations and report changes for LCP/INP/CLS, not a field percentile. Test conditions/results are in `SEO-PERFORMANCE.json` and the audit. No Lighthouse score is claimed.

## Validation and maintenance

ESLint 10 and official Next core-web-vitals/TypeScript configurations now have a `lint` script. Narrow documented exceptions preserve four pre-existing effects that reconcile client-only storage, intro/media state and CAPTCHA resets. The static image rule is scoped to intentional native-image components; other lint rules stay enabled. Existing tests plus four SEO policy/image tests total **22 passing tests**.

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:seo`, `npm run check:export`, and `node scripts/check-external-links.mjs`. The SEO audit parses actual HTML with parse5, checks duplicate metadata, canonicals, social fields/files, heading counts, initial content, image dimensions, schema relationships, internal fragments and indexing mode. XML was also parsed independently.

The footer now reads **© 2026 J0hnvexcoder. All rights reserved.** with its name linked to the verified GitHub profile. The separate Designed & Developed credit remains.

Required handoff documents: `SEO-AUDIT.md`, `SEO-KEYWORD-MAP.md`, this implementation record, `SEO-MONTHLY-REPORT.md`, and `GOOGLE-SEARCH-CONSOLE-SETUP.md`. Search Console instructions require the owner's real verification token/access and an approved public release; nothing has been submitted on the owner's behalf.

## Primary guidance

- [Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [WebSite / site names](https://developers.google.com/search/docs/appearance/site-names)
- [ProfilePage guidelines](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google image guidance](https://developers.google.com/search/docs/appearance/google-images)
- [GoogleChrome web-vitals](https://github.com/GoogleChrome/web-vitals)
- Bundled Next.js 16.4 documentation: Metadata API, sitemap, robots, static export and ESLint.
