# J0hnvexcoder — Signature Portfolio

The portfolio of John Angelo De Joya: freelance websites, full-stack applications and Linux infrastructure, based in Bulacan, Philippines. Production: https://johnvexcoder.github.io/.

Version 2.1.3 retains the established dark theme, blue accents, motion and compact Skills layout. The shared content catalog describes 26 projects, nine individual service pages and 40 canonical landing pages. Project classifications distinguish client work, personal software and demonstrations; demos do not imply production backends, payments or verified client outcomes.

## Development

Use Node.js 22.18 or later and the committed npm lockfile.

```sh
npm ci
npm run dev
```

```sh
npm run check:hygiene
npm run lint
npm test
npm run build
npm run typecheck
npm run check:seo
npm run check:export
```

Next.js 16.4.3 builds a static export in `out/`, with trailing-slash routes and unoptimized images selected from prepared responsive assets. Shared JSON content generates the HTML, public Markdown mirrors and lightweight browser catalogs. Markdown and `llms.txt` supplement the canonical HTML. Fonts served to visitors are Latin subsets; font masters in `assets/fonts/` support optional authoring only, with original licenses retained.

## Publication and recovery

The single essential `.github/workflows/deploy-pages.yml` checks and builds locked source, uploads only `out/` and publishes through GitHub Pages. Only pushes to `main` or explicit workflow dispatch deploy; tag and Release creation do not deploy. Development branches remain unpublished. No hosting migration is part of this release.

`public/release.json` is generated during builds and identifies the package version, exact Git source SHA and canonical origin. The Next.js build ID uses that same SHA. Do not commit generated release metadata or hand-edit it to claim a different revision.

The annotated `v2.1.2` tag and the **Portfolio Version 2.1.2 — Pre-Deployment Backup** GitHub Release preserve the preceding live source and verified static archive. The ZIP includes its manifest, checksums and restore instructions. It is separate from the new v2.1.3 source. Existing `v2.1.1` and older history remain unchanged. See `CHANGELOG.md` for the new release scope.

## Privacy and maintenance

Contact requests use the existing Formspree integration, client-side validation and honeypot; hosted anti-spam/provider configuration must be verified separately. Never publish private inquiries, environment secrets, browser profiles or account exports. Analytics loads only after explicit consent; localhost does not load the production tag. Keep GA4 Enhanced Measurement disabled when this integration owns page views and form events; details are in `docs/GA4-REBUILD.md`.

Local AI instructions, isolated tool installations, generated QA observations and private consolidation notes remain ignored and untracked. Useful source, tests, attribution, design and deployment documentation stay in Git. Historical documentation describes its stated date and is not a claim of current Google indexing or performance.

Sitemap delivery and Google processing are separate checks. Verify the public sitemap and stored Search Console records after publishing; deployment alone does not prove indexing or ranking. No sitemap renaming, hosting change or indexing promise is implied.
