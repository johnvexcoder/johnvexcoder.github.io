## Local enhancement — 31 October 2026

Six additional demonstrations and case studies are integrated, with centralized service associations, responsive WebP previews, motion refinements and expanded SEO checks. The owner authorized commit, push and a live check on 31 October 2026 after local validation; publication status is recorded in the final implementation report. See `docs/PROJECT-INTEGRATION-2026-10-31.md`, `docs/DESIGN-SYSTEM.md`, `docs/DEVELOPMENT-TOOLS.md` and `docs/seo/IMPLEMENTATION-REPORT.md` for current scope, validation and remaining actions. The framework and lint configuration are patched to Next.js 16.4.3; GitHub Pages remains the deployment target.

## Current development source — 13 October 2026

The authoritative standalone repository is `/home/j0hn/Projects/My-Portfolio-v2`. The deployed v2.1.0 baseline is `d9cea0a`; further SEO refinements are local and require separate publication approval. The prior production release `v2.0.1` and current `v2.1.0` are preserved. Migration, backups and detailed acceptance evidence are recorded in the owner’s local consolidation report, which is intentionally excluded from publication.

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

Contact inquiries use the configured Formspree endpoint with hosted spam verification. Service enquiries preselect the relevant option on the dedicated contact page. Direct email/profile links and the résumé remain available from the original portfolio. The old email-draft and Copy Inquiry flow has been removed.

## Analytics and consent

Google Analytics 4 is optional and loads only after explicit acceptance. The public measurement ID and public route catalog live in `lib/analytics-config.mjs`. Consent persists in local storage, with a session-only fallback when storage is blocked. Privacy Settings in the footer allows withdrawal; it immediately blocks events, clears only this integration’s analytics cookies and reloads the current page to stop the loaded library. Localhost and previews never load the production tag. Page views use sanitized catalog routes with manual deduplication. **Before publishing, disable Enhanced Measurement in the GA4 web stream**, including browser-history page views and form interactions; this implementation owns page views and custom events. See `docs/GA4-REBUILD.md` for the event allowlist, privacy safeguards, manual property settings and validation evidence.

## Modernization development requirements

The application remains a Next.js 16.4.3 static export for GitHub Pages. Use Node.js 22.18+ and Python 3 for the standard-library sitemap XML gate. `npm run build` regenerates 36 public Markdown mirrors from shared content, creates the static export and validates the sitemap namespace, canonical inventory and dates. `npm run check:seo` and `npm run check:export` validate metadata, links, mirrors and source-map-free output. Generated `public/markdown/` files are ignored and rebuilt; do not edit them independently.

New standalone routes are `/about/`, `/work/` and `/contact/`. All 25 projects and existing service routes remain intact. Both inquiry forms use the supplied Formspree endpoint and the owner-selected hosted verification. The default dashboard reCAPTCHA rejects direct AJAX without a custom key, confirmed by a real 403 response; it is not disabled. Native provider verification owns acceptance. The optional async adapter is tested, but must not be selected without configuring compatible embedded verification.

Project-only tooling, provenance and limitations are documented in `docs/codex/`. Keep raw Search Console exports, private analytics reports, browser profiles and credentials out of Git.

The November modernization adds About, Works and Contact routes, shared public Markdown content, hosted Formspree verification and a bounded geographic portrait animation. See [requirements coverage](docs/REQUIREMENTS-COVERAGE.md), [motion standard](docs/MOTION-PERFORMANCE-STANDARD.md), and [Search Console handoff](docs/seo/SITEMAP-HANDOFF-2026-11-01.md). Still project thumbnails are generated before the build; original full screenshots remain available in case studies. The résumé filename is owned by `content/resume.json` and its download links preserve the supplied name.
