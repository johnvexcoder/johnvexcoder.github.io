# Portfolio — GitHub Pages deployment

Production origin: https://johnvexcoder.github.io/. Source repository: johnvexcoder/johnvexcoder.github.io, main branch. The single essential workflow `.github/workflows/deploy-pages.yml` builds and publishes the static export with official actions pinned to commit SHAs. Only pushes to main or explicit workflow dispatch deploy; tags and Releases do not deploy.

The workflow installs locked dependencies, checks source hygiene, lint and tests, builds the static export, then verifies types, SEO, local references, source/version provenance and the Google verification file. Only `out/` is uploaded. Build-time source, documentation, AI instructions and private local files are not publication inputs. NEXT_PUBLIC_SITE_URL is the production origin and SITE_INDEXING is production. Source and framework build identifiers are recorded in the generated `release.json`; package versioning does not prove successful publication by itself.

Development branches are unpublished. Run the complete release gate on a committed candidate before promoting that exact revision to main. Verify the deployment record, public release marker, all canonical routes, assets, sitemap/robots and non-destructive form/navigation checks after publishing. Do not change Pages settings or replace this workflow without testing a safe equivalent.

## Verified rollback baseline

The annotated `v2.1.2` tag identifies source `00059d9e1a9e46bf091022217129b1ab62051679`, previously live through successful Actions run `41243608533`. Its pre-deployment backup Release contains the verified static archive, corresponding source, manifest, hashes and restore instructions: https://github.com/johnvexcoder/johnvexcoder.github.io/releases/tag/v2.1.2.

The original one-day-retention Actions artifact expired. The backup retains every actual published file from the original run's exhaustive 502-file deployment inventory; no newly rebuilt output was substituted. Its original framework build ID is WYpiHSwHF1wnGJn15Iuza. The archive's static tree passed extraction, hash and browser restore checks.

The github-pages environment currently permits the main branch only. Do not dispatch a deployment directly from the v2.1.2 tag: its deployment job would be blocked by that existing policy. Leave protection settings unchanged.

For an authorized source rollback, create an isolated recovery checkout based on current origin/main, restore the verified archive source snapshot into that checkout, review the resulting source and create a normal recovery commit. Promote that reviewed commit to main with a fast-forward push, then monitor the existing publisher and independently verify the recovered site. Preserve owner files in the original checkout. Rebuilding the old source can produce a new framework build ID or other generated differences; it is not a byte-identical static restore.

For exact-byte recovery, feed the archive's verified static tree to the same Pages artifact upload/deploy actions from a reviewed restore job on the permitted main ref. Upload only the static tree and check its hashes; do not publish the archive, source or manifest. This requires a reviewed recovery commit/job, not a protection bypass or host/settings migration. The backup Release's RESTORE-ADDENDUM.md corrects the tag-dispatch instruction contained in the immutable original ZIP. Do not force-move version tags or rewrite shared history. A dry run is not a production rollback.

The older `v2.1.1` Release remains unchanged. Keep production backup assets outside the website output. The Google HTML verification file remains required; stored Google processing/indexing status must be checked separately from public crawlability. Sitemap submission and indexing requests are separately controlled owner actions.
