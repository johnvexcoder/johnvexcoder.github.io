# Phase 2 deployment review — October 11, 2026

Status: prepared and validated locally. No remote write, commit, push, workflow dispatch or new production deployment has occurred. Owner approval is required before publishing.

## Confirmed production destination

- Repository: https://github.com/johnvexcoder/johnvexcoder.github.io
- Deployment branch: main
- Current reviewed base: 5cac9135d317c8e3175e4e0fbb6675c939818e40 (remote main still matches)
- Workflow: Deploy Portfolio V2 to GitHub Pages
- Workflow file: .github/workflows/deploy-pages.yml (unchanged), workflow ID 380597842
- Trigger: push to main; existing manual workflow_dispatch also supported
- Pages configuration: workflow deployment; github-pages environment; source main /; HTTPS enabled; no custom domain
- Public destination: https://johnvexcoder.github.io/
- Existing successful run: https://github.com/johnvexcoder/johnvexcoder.github.io/actions/runs/38062027912 (same base SHA)
- Source: /home/j0hn/Projects/My-Portfolio-v2
- Independent prepared checkout: /home/j0hn/Documents/Codex/2026-10-11/s/work/portfolio-release

The source directory inherits the unrelated /home/j0hn/Projects Git repository. It was not staged, committed or pushed. The independent checkout is a clone of the actual GitHub portfolio repository on main. Every original tracked blob was verified against GitHub’s tree before copying the explicit publication files. No tracked file is deleted; all other tracked source, assets, dependency manifests, lockfile, configuration and deployment workflow match the production base. An attempted dependency symlink was rejected by the build tool’s filesystem boundary; replacing it with a local dependency copy resolved that environment issue without a source/configuration change.

## Final changes and before/after

The historical SEO-AUDIT-2026-10-11.md and SEO-EVIDENCE-2026-10-11.json describe the completed original SEO audit before the later archeon and search requests. This review supersedes their page totals and their statement that CSS/catalog were unchanged.

| Area | Production before | Prepared after |
| --- | --- | --- |
| Homepage title | John Angelo De Joya / Web Developer Philippines / J0hnvexcoder | J0hnvexcoder / Freelance Web Developer in Bulacan |
| Identity | Full name and official alias; shortened name and handle present separately | All four supplied variants naturally associated in visible About copy and Person alternateName; legal name unchanged |
| Descriptions | 18 unique case descriptions; six weak/generic/demo scope unclear | Six factual targeted replacements, others retained; archeon adds its own accurate title/description |
| Canonicals/robots | Valid canonical and production crawling configuration | Existing URLs/directives retained; new archeon self-canonical |
| Structured data | Working ProfilePage and BreadcrumbList | Preserved; shared homepage description improved, aliases added to Person/WebSite, new archeon uses existing case schema |
| Discovery | Real static case-study anchors | Preserved and more descriptive labels; archeon also linked in initial HTML |
| Sitemap | 19 URLs: home + 18 cases | 20 URLs: home + 19 cases, only archeon added from catalog; generator unchanged |
| Images | About photo single 1000px file; case screenshot lazy | Same About image with smaller responsive WebPs/async decode; principal case screenshot eager/high priority, archive lazy |
| Search | Basic field; first signature attempt oversized with embedded index | 48px field, 16px text, centered icon/text/44px clear control; index outside; scope limited to collection search |

archeon uses the exact owner-provided live URL https://demo-archeon.vercel.app and the actual supplied screenshot. Its metadata and case text describe an architecture demo with a nine-stage 3D construction sequence, interactive concept floor plans and a local project-brief download. It does not claim a completed architectural commission or server-side form delivery. Added capture PNG/WebP and sharing JPEG follow the existing asset conventions. Original cards, project URLs and all prior catalog entries remain.

The search implementation and browser results are documented in SEARCH-REFINEMENT-2026-10-11.md. Matching now covers title, short/full descriptions, technologies and category, case-insensitively with trimmed query whitespace. Text/category/featured filters intersect. Clear and Escape clear only text; Reset filters explicitly resets all filters. The dynamic status count and helpful empty state use the actual catalog. The 19-project index is derived from the catalog, not hardcoded. Existing animations, navigation, card layouts and rest of homepage design remain.

## Validation

Both the existing source and independent prepared checkout pass production build, lint, explicit TypeScript check, all 22 existing tests, SEO validation and export validation. The prepared checkout uses the unchanged package lock and a local copy of installed dependencies; the existing GitHub workflow installs locked dependencies with npm ci.

- 20 content pages and sitemap URLs, including all 19 case studies
- 783 internal links, 635 fragment references and 80 structured-data nodes checked
- 21 exported routes inspected, 560 local asset/link references validated
- Existing Google verification file matches export; .nojekyll exists
- git diff --check passes; no tracked deletions or unexpected files
- Browser tested widths 1440, 1920, 768, 390 and 320: 48px field, 16px type, exact shared vertical center, no horizontal overflow
- Real titles, technologies, category terms, whitespace, mixed case, partial queries, no matches, combined filters, clear, Escape, Tab/Enter and reset verified

## Exact files to publish

Only the following source/assets/reports are included in the prepared change set. The workflow builds and uploads the complete out directory, including every unchanged page and asset; this is not a partial website upload.

- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/work/[id]/page.tsx`
- `components/Preview.tsx`
- `components/ProfileSections.tsx`
- `components/Projects.tsx`
- `content/media.json`
- `content/projects.json`
- `docs/EXPORT-CHECKS.json`
- `docs/SEO-CHECKS.json`
- `lib/seo-policy.ts`
- `lib/seo.ts`
- `scripts/check-seo.mjs`
- `tests/content.test.mjs`
- `tests/seo.test.mjs`
- `scripts/prepare-about-image.mjs`
- `public/source/me/john_aboutme-480.webp`
- `public/source/me/john_aboutme-768.webp`
- `public/source/projects/archeon/archeon.png`
- `public/source/projects/archeon/capture.png`
- `public/source/projects/archeon/capture.webp`
- `public/social/archeon.jpg`
- `docs/SEO-AUDIT-2026-10-11.md`
- `docs/SEO-EVIDENCE-2026-10-11.json`
- `docs/SEARCH-REFINEMENT-2026-10-11.md`
- `docs/SEARCH-BUILD.txt`
- `docs/SEARCH-LINT.txt`
- `docs/SEARCH-TEST.txt`
- `docs/SEARCH-TYPECHECK.txt`
- `docs/SEARCH-CHECK-SEO.txt`
- `docs/SEARCH-CHECK-EXPORT.txt`
- `docs/PHASE2-DEPLOYMENT-REVIEW-2026-10-11.md`

## Remaining issues and deployment procedure

No live-site success is claimed. Existing large long screenshots remain to preserve readability and animation behavior. The documented MovieFlix private/self-hosted demo may require its network; the public case page is crawlable. Responsive browser tests do not substitute for a physical-device keyboard or assistive-technology test. Google indexing, rich-result presentation and field Core Web Vitals remain external verification steps; no ranking promise is made.

After explicit approval: recheck remote main against the reviewed base, commit only this manifest in the independent portfolio checkout, push main to the verified origin, wait for the existing Pages workflow, inspect its deployment status, and verify live home metadata/identity, archeon page/link/image, search, robots, sitemap and representative existing cases before recording a successful deployment. If remote main moves or the change set differs, review the difference before publication. The preceding production commit remains the rollback reference.
