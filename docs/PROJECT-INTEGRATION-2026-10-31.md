# Project and service integration — 31 October 2026

This checkpoint records completion of the first two owner directives before the motion/SEO follow-up work. At this checkpoint, all changes were local; publication was subsequently authorized by the owner.

## Discovery and preservation

The standalone portfolio uses Next.js App Router, React, TypeScript, CSS tokens, static export and trailing-slash routes. GitHub Pages remains the deployment target. Existing metadata helpers, sitemap, JSON-LD, project cases, analytics-consent controls and verification file were extended or retained. The pre-existing next-env.d.ts change, local consolidation document and six source screenshot directories are preserved. None of the other project repositories was modified.

## Six-project integration matrix

| Project | Portfolio case route | Verified demo | Services |
| --- | --- | --- | --- |
| Bedrock Events | `/work/bedrock/` | https://demo-bedrock.vercel.app/ | Business websites; booking-interface examples |
| AURVÉL | `/work/aurvel/` | https://demo-aurvel.vercel.app/ | Business websites |
| RAJ & T Marine Services | `/work/rajt-marine-services/` | https://demo-rajt-marine-services.vercel.app/ | Business websites/redesign |
| Aurevia Journeys | `/work/aurevia/` | https://aurevia-xi-ten.vercel.app/ | Business websites; booking interfaces; custom applications |
| Voyara Operations | `/work/voyara/` | https://voyara-ruddy.vercel.app/overview | Custom applications; CMS interfaces; booking interfaces |
| Aurelia Grand | `/work/aurelia/` | https://aurelia-five-teal.vercel.app/ | Business websites; booking interfaces; custom applications |

All six URLs returned HTTP 200 in Playwright. Desktop and 375px captures were inspected; Voyara was verified again after its IndexedDB initialization completed. All are demonstrations, not asserted commissioned client projects. RAJ & T is explicitly an unofficial concept. Aurelia and AURVÉL represent fictional products/properties. Voyara is seeded, browser-local software, not evidence of production authentication, financial transactions or actual company revenue.

## Architecture and case-study content

`content/projects.json` owns identities, URLs, technologies, image paths and serviceIds. `content/case-studies.json` owns the longer, unique narrative for each stable ID. Case pages use the existing `/work/[id]/` route, not duplicate `/projects/` pages. Each has an overview, problem, engineering decisions, capabilities, verified scope, technical toolkit, related work, all associated services, breadcrumbs and a contact CTA. No dates, client outcomes, ranking results or testimonials were invented.

Service examples are derived from project.serviceIds. Hardcoded example arrays were removed from the Services registry. Existing service pages already cover the distinct, supported commercial topics; frontend, responsive design and redesign remain within those pages rather than becoming repetitive landing pages. International enquiries are welcome without invented offices or geographical doorway pages.

## Assets and previews

The six original PNGs are retained. `scripts/prepare-project-previews.mjs` generates dedicated `<id>-full-preview.webp`, 480px and 960px variants where appropriate, measured metadata and genuine screenshot-based 1200×630 sharing images. See `seo/PROJECT-ASSETS.json` for exact bytes and dimensions.

The shared Preview component now uses Web Animations transforms rather than writing scrollTop every frame. IntersectionObserver, document visibility, reduced-motion preferences, hover, focus and touch govern its lifecycle. Travel time follows actual image overflow at 42 rendered pixels per second with endpoint pauses. Manual exploration transfers the current visual position to native scrolling; full screenshots can be opened separately. Controls reserve space before image loading. Service examples reuse the same browser-frame component.

## Search and monitoring

All case routes join the existing sitemap and retain portfolio-domain canonicals. The established metadata utility generates distinct titles/descriptions and genuine social images. CreativeWork, WebPage and BreadcrumbList reuse the same professional identity. A small generated llms.txt directory was explicitly requested; it is a public link convenience, with no claimed ranking effect.

Search Console verification and analytics consent remain intact. `seo/SEARCH-CONSOLE-GUIDE.md` documents a lightweight reporting procedure, country segmentation, period comparisons and the minimum read-only API scope. Private metrics are unavailable; no Google indexing or ranking improvement is claimed.

## Validation

59 tests, typecheck, clean lint, a patched Next.js 16.4.3 build, the 33-page SEO audit and 34-route export validation passed. Playwright verified all six cases, automatic/manual preview controls, 375/430/768/1024/1440/1920px layouts, reduced motion and meaningful content without JavaScript. No page errors were recorded. The production dependency audit reports zero vulnerabilities. Publication, Search Console submission and public rich-result checks remain separate owner actions.
