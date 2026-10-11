## Portfolio Version 2.0.0 publication

The owner approved replacing the existing GitHub Pages portfolio with V2 on 10 October 2026. The repository contains the editable Next.js source; `.github/workflows/deploy-pages.yml` validates and exports it before publishing `out/` through GitHub Pages. Future pushes to `main` deploy only after the checks succeed. Release tags do not trigger deployment.

Production origin remains https://johnvexcoder.github.io/. Pages uses GitHub Actions as its publishing source; no DNS change is required. The exact downloaded Google verification file is retained in `public/google1c03abb64b8da92a.html` and checked during every export. The owner clicks VERIFY in Search Console after checking its public URL.

The pre-V2 live source is retained by the rollback tag `portfolio-v1-before-v2-2026-10-10`. Version 2.0.0 release downloads include the Next.js source and the complete static export. Earlier handoff documents record local-only preparation before deployment approval and should be read with that date context.

# J0hnvexcoder — Signature Portfolio V2

A local-first Next.js portfolio built around John De Joya's actual portrait, original project catalog and professional background. The centerpiece is a centered portrait in front of oversized branding, connected to a wordless network-restructuring intro. All development belongs to `/home/j0hn/Projects/My-Portfolio-v2`; both reference projects remain read-only.

## Run locally

Use Node.js **22.18 or newer** and npm. The higher Node requirement also supports the TypeScript motion tests without a separate test compiler.

```sh
cd /home/j0hn/Projects/My-Portfolio-v2
npm ci
npm run dev
```

Open `http://127.0.0.1:3003/`. Stop with Ctrl+C. This binds only to the local computer.

For the production static export:

```sh
npm run typecheck
npm test
npm run build
npm start
```

`npm start` serves `out/` locally on port 3003; stop the development server first. The preview server has real 404 responses and serves directory index documents, including all case pages and the two preserved browser demos. `PORT=3004 npm start` can choose another local port if needed. The `out/` directory is the deployable artifact; it needs no Node process or database on the destination host.

## Configuration

Copy `.env.example` to `.env.local` if needed. The owner confirmed **https://johnvexcoder.github.io/** as V2's production origin on 10 October 2026. `NEXT_PUBLIC_SITE_URL` controls canonical metadata, schema, robots and sitemap and must be a HTTPS root origin without credentials, path, port, query or fragment. Root-relative asset paths assume deployment at the domain root. A future domain change needs owner approval and a new build.

Use `SITE_INDEXING=production` for the intended public release. A separate staging build can explicitly use `SITE_INDEXING=preview`: its pages are noindex, its sitemap is empty and robots allows crawling of the noindex. Normal production has no performance telemetry. Local-console diagnostics can be enabled with `NEXT_PUBLIC_PERFORMANCE_DEBUG=true`; development diagnostics are enabled automatically. They send nothing to an analytics service.

`NEXT_PUBLIC_REVIEW_ACCESS_KEY` optionally overrides the original portfolio's **public** Web3Forms form identifier. It is designed for client-side use, not a secret credential. Never put a private API token into a `NEXT_PUBLIC_` variable. The original review flow is retained with hCaptcha, permission to publish, native validation, a honeypot, submission/error states, and manual moderation. hCaptcha and Web3Forms need a working network and valid provider/domain configuration. No real reviews or emails were submitted during QA. [Web3Forms public access identifier FAQ](https://docs.web3forms.com/getting-started/faq) and [hCaptcha integration](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha).

Contact prepares an email in the visitor's email application; it does not send mail from the site. Service enquiries prefill the subject. Contact/profile links and the résumé come from the source portfolios.

## Analytics and consent

Google Analytics 4 (`G-11E1T1HREX`) is installed once from the root layout with `next/script` (`afterInteractive`, so it never blocks rendering) and Google Consent Mode v2. Analytics storage is **denied** until a visitor accepts, and the choice is stored locally under `j0hnvexcoder-analytics-consent`; clearing browser storage asks again. Page views are owned by GA4 Enhanced Measurement — keep **Page changes based on browser history events** enabled in the GA4 property, and never add manual `page_view` calls (that would duplicate data). Custom events cover project demos/references, contact links, résumé downloads, service enquiries and successful review submissions. No form field, email address, name or message content is ever sent; `lib/analytics.ts` also strips known personal-data keys defensively. Local development keeps the consent UI and event wiring but does not send data to the live property.

## What was migrated

- All **14** original catalog entries and their actual fields, descriptions, classifications, icons, screenshots, repository/documentation/release destinations, demo disclaimers and availability.
- Four recent live sites, for **18 total projects**: J&GLO, ARKOSENYO, TAITECH Marine, and Shoes on the Go. Their exact live URLs were supplied by the owner; their source full-page screenshots are copied and optimized. Descriptions use the served site metadata and the owner's footwear-project brief. New unverified technology lists and client claims were not invented.
- Four exact categories: **Infrastructure, Software, Web, CLI**. Filters, technology/name search, Featured selection, an empty/reset state, and 18 static project detail routes.
- Three existing future concepts are shown separately, with their original Planned/In Development wording and no completed-product claim.
- Five authentic client reviews, including masked names, ratings, company labels and avatars.
- Four work-history entries, four services, original capability layers, qualifications, skills, personal background, contact links, résumé, local fonts and actual infrastructure specifications.
- The two original local demos, Starbucks Login and Smart Expense Visualizer, are served under `/demos/`. Their original browser-only functionality and unofficial/demo identity are preserved.
- The philosophy tagline has visible quotation marks, champagne detailing and a blue-white text treatment in About, as requested in the latest revision. The full-screen hero introduces the practice with “From interface to infrastructure.” The old tagline is absent from active V2 UI and metadata. The footer reads **Designed & Developed by J0hnvexcoder** and links to the verified profile.

`docs/DISCOVERY.md` records the source inventory. `docs/SOURCE-SNAPSHOT.json` records the initial 498 file hashes. The newly added `My-Portfolio/work/shoesonthego/shoesonthego.png` was provided by the owner after that snapshot; no original files were changed by this implementation.

## Architecture

- `app/`: layout, homepage, static `/work/[id]/` routes, metadata, sitemap, robots and 404.
- `content/`: normalized source project/profile/review/concept records and measured image dimensions. Edit these files to maintain the content.
- `components/`: independent hero, project archive, screenshot viewport, infrastructure diagram, Professional System, profile sections, feedback, contact, header/footer and native dialog components.
- `components/SceneMotion.tsx`: one event-driven coordinator for reversible section assembly, bounded contact rebound and fine-pointer parallax. Only nearby visible scenes are updated; scroll/pointer frames are coalesced. Selection state uses data attributes so React cannot remove playback classes.
- `hooks/useFeedbackMotion.ts`: measured endless loop with hold, drag/swipe, horizontal wheel, Shift-wheel and keyboard scrubbing; native vertical page scrolling remains available.
- `hooks/useMedia.ts`: reactive OS-level reduced-motion preference, with listener cleanup.
- `lib/motion.ts`: measured screenshot cycle, manual-position continuation, testimonial track coverage, two-direction seam wrapping, bounded assembly/rebound and bounded scroll assembly. These are tested as pure functions.
- `app/globals.css`: reusable color/font/spacing/surface/easing tokens, responsive art direction, focus states and reduced-motion CSS.
- `public/source/`: copies of existing images and project marks. Original portraits remain intact. The alpha portrait is optimized losslessly; newer long captures use WebP copies with retained dimensions.
- `public/fonts/` and `public/licenses/`: local fonts and attribution notices.
- `scripts/`: asset preparation, a local static preview, public-link verification and export checks.

CSS/SVG handle the visual systems; the feedback loop uses the browser animation API. No decorative WebGL engine or unused motion library is shipped. Screenshot frames run only while visible, with actual overflow, outside manual interaction, and with motion permitted. Observers, timers, events and frames are cleaned up on teardown.

## Motion and interactions

The 3.6-second “Beyond the Fix” opening uses one shared timeline: System 0–650ms, Failure 650–1150ms, Restructure 1150–2200ms, Stabilize 2200–2850ms, Hero Morph 2850–3600ms. Twelve deliberate nodes become eight on small screens. The weak 6–7 edge actually disappears; alternate routes form around it. Generated SVG geometry keyframes are included in the initial HTML, so the correct network is visible before hydration. The same SVG becomes the hero background; it is never replaced by a separate splash screen.

`lib/intro.ts` owns timing, node positions, edges, easing samples and the first-paint bootstrap. `NetworkScene` renders the shared SVG; `useIntroPlayback` owns skip/completion and cleanup. The intro plays once per browsing session using sessionStorage. Refresh and internal navigation skip it; reduced motion and unavailable storage reveal the hero immediately. Escape, the keyboard-accessible Skip Intro control, or interaction with a link/button/input can end it early. No focus trap, loading percentage, or motion toggle is added. CSS finishes at 3.6s even without hydration; a 4.2s safety bound clears the boot state. Development-only `/?preview-intro` enables visual replay and is disabled in production.

The tagline remains in About, honoring the direct placement request. The wordless sequence conveys its philosophy before the visitor reaches it.

The first hero occupies the screen below the fixed navigation. The same center portrait/wordmark composition remains at 360–1920px. Secondary interface, host/VM/app, automation and verification systems have different rhythms with pauses. The portrait's face, shoulders and proportions are preserved. A mask follows the portrait's own image bounds, fading its lower edge smoothly at every screen size without a separate stage overlay or exposed leg fragments.

Section headings and project narratives/previews assemble into place as they enter, reverse when scrolling back, and separate on departure. A small SVG topology bridge brings opposing components together with a restrained contact pulse and rebound. Hover feedback includes icon movement, preview light/tilt, button sheen, archive actions and social arrows; the hero has subtle pointer counter-parallax. All of this respects reduced motion.

The 28 skill entries are compact icons with accessible names, hover/focus tooltips and tap-to-reveal labels. The 26 brand SVGs are self-hosted, with Devicon/Simple Icons license notices; Networking and localStorage use clear generic symbols.

Long screenshots pan down, pause, return up and pause without a snap. The travel distance is derived from the actual image/container heights. Hover, focus, wheel, keyboard and touch hold automatic motion; explicit Explore mode remains manual until released. Automatic motion resumes after a six-second grace period from the visitor's current position. Native inner scrolling can chain back to the page at its boundaries. Normal screenshots use `object-fit: contain` and do not pan.

Infrastructure selection changes the active SVG routes/nodes and adds guest/service/backup information. The Lenovo M710q / i5-7500 / 16 GB DDR4 / 2 TB SSD / Proxmox pve0 data is actual source content. The three guest labels reflect two Debian guests and one Ubuntu guest, without invented service assignments. The visualization is explicitly illustrative, with no live telemetry.

The Professional System preserves Interface, Application, Infrastructure and Operations. Each selection changes the connected diagram, source description/toolkit and four meaningful workflow stages.

Client feedback translates one measured original group width, followed by enough identical visual groups to cover the viewport. Its duration derives from a consistent 28px/second pace. Hold or hover pauses it for reading; drag/swipe left or right, horizontal wheel/Shift-wheel or focused arrow keys scrub the same loop. Releasing touch/wheel resumes from the new position after a short grace period; mouse hover and keyboard focus stay paused until leaving. Clones are `aria-hidden`; there are no play/pause or carousel controls. The reduced-motion version contains one manually scrollable group. Count-independent coverage is tested for one, two and several variable-width reviews.

Navigation retains the original eight destinations, active-section tracking, keyboard quick navigation, mobile menu and dark/light theme. The decorative terminal remains bounded and cannot execute system commands. All external arrows are SVG icons, avoiding emoji glyph substitutions.

## A route worth getting lost in

`components/LostRoute.tsx` is a reusable React/SVG experience: layered expanding topology, illuminated route signals, an outlined compass zero, fine-pointer parallax and a bounded interactive reroute pulse. It includes real project search and useful home/contact recovery links. There are no fabricated terminal requests or diagnostics. Ambient effects pause offscreen and respect reduced motion.

`app/404/page.tsx` exposes `/404` (and `/404/` with trailing-slash routing). `app/not-found.tsx` shares the same design for genuinely missing pages. The static export includes both `/404/index.html` and `/404.html`. Direct access is available, while the error page is intentionally noindex and excluded from the sitemap so it does not compete with real portfolio pages in search results. Configure a static host to serve `/404.html` with HTTP 404 for unknown paths; avoid an SPA fallback that returns HTTP 200 for missing pages.

## Search and sharing images

Every detail page has its own title, description, canonical URL, Open Graph and large Twitter image. Image previews are generated from actual project captures; the three projects without screenshots use an honest author portrait fallback. The home preview uses the actual portrait, without a text-heavy advertisement. The image sitemap identifies source captures and preview files. ProfilePage/Person and WebPage/CreativeWork/Breadcrumb structured data use verified content, with no invented review aggregates, certifications or product offers.

Set `NEXT_PUBLIC_SITE_URL` to the exact approved public root URL **before building for deployment**. The verified existing portfolio URL is only the default; do not leave it pointing at the old domain when publishing V2 elsewhere. The site is intended for a root domain, rather than a subdirectory. Optionally set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the public Search Console verification value. It is not a secret.

After an approved deployment: verify ownership in Google Search Console, submit `/sitemap.xml`, inspect the home and representative project URLs, check rendered structured data and image availability, then monitor coverage and search queries. Public indexing and rich results are controlled by Google, and ranking cannot be promised. Do not create fake keywords, location pages or ratings to chase rankings.

The implementation follows [Google's image guidance](https://developers.google.com/search/docs/appearance/google-images), [SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), and [ProfilePage guidance](https://developers.google.com/search/docs/appearance/structured-data/profile-page). `scripts/check-seo.mjs` verifies the actual exported metadata, image dimensions and sitemap.

## Deployment after approval

No public deployment, DNS change or remote push has been performed.

### Vercel

After approval, use this directory as the project root, install with `npm ci`, build with `npm run build`, and use `out/` as the output. `vercel.json` contains the Next.js/static-output settings. Set the intended site URL environment variable before the production build. Verify canonical URLs, case routes and provider-backed reviews on the final domain.

### Hostinger / another static host

A plan that supports static file uploads, directory index files, JavaScript/CSS/image delivery and HTTPS can serve the exported site. Upload the **contents** of `out/` into the chosen document root (commonly `public_html`), retaining `_next`, `fonts`, `source`, `work` and `demos`. A Node application plan is unnecessary for this export; do not assume a particular Hostinger plan supports Node, since the site does not require it. Configure the host's 404 document to `/404.html`. Do not deploy source files, `.env.local`, `node_modules`, or `.next` as the public directory.

This follows [Next.js static export support](https://nextjs.org/docs/app/guides/static-exports). The project avoids server actions, runtime API routes, a database and Vercel-only services. CAPTCHA/review delivery remains dependent on its original external provider; static hosting does not replace that service.

## Maintenance and verification

```sh
npm run lint
npm test
npm run typecheck
npm run build
node scripts/check-export.mjs
node scripts/check-seo.mjs
node scripts/check-links.mjs
node scripts/check-external-links.mjs
```

`npm run prepare:assets` regenerates copies and dimension data using source files already present inside V2, without touching the reference directories. Keep the retained original `capture.png` files for regeneration. New media must also have a source capture and valid metadata.

Run `npm run prepare:portrait` after regenerating the original portrait to refresh its lossless responsive variants. Current tests total 27; `docs/SEO-AUDIT.md` records the latest SearchEdge checks and limitations. The five SearchEdge handoff documents include the keyword map, implementation record, monthly template and exact Search Console setup. No recurring monitoring or Search Console submission has been performed.

For the confirmed GitHub Pages origin, publish the contents of `out/` only after approval. Preserve `.nojekyll`, `_next/`, the case directories and any real existing Search Console verification files. `docs/GOOGLE-SEARCH-CONSOLE-SETUP.md` explains replacement at the same origin and an owner-approved future Hostinger migration. No deployment workflow has been added or run.

Portable content tests compare against retained source fixtures. The read-only hash audit additionally checks the original reference repositories when they are present; on another machine that one audit is explicitly skipped.

Read `docs/VERIFICATION.md` for actual browser results, build/test evidence and unmeasured checks. Lighthouse scores are not claimed. MovieFlix retains its private Tailscale destination and may need the owner's network access. No screenshots were fabricated for Nexora Agent, Python-Keybr or DistroZSH; their explicitly labeled interface illustrations are intentional fallbacks.
