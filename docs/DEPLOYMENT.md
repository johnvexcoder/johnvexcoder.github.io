# Portfolio V2 — GitHub Pages deployment

The owner approved public V2 deployment on 10 October 2026. Origin: https://johnvexcoder.github.io/.

Source: main branch of johnvexcoder/johnvexcoder.github.io. Pages publishing mode: GitHub Actions. Workflow: .github/workflows/deploy-pages.yml, using official actions pinned to commit SHAs. It installs the lockfile, runs lint/tests, builds a production static export and checks SEO/local references/verification-file integrity before publishing out/. Only pushes to main or explicit workflow dispatch deploy; release tags do not.

NEXT_PUBLIC_SITE_URL and SITE_INDEXING are set in the build job to the approved origin and production indexing mode. No private environment files or credentials are committed. The source-reference checksum test skips on a clean CI runner because the owner's two reference repositories are absent; the recorded local check passed. No assets or content from those reference repositories are changed by deployment.

The exact Google file is checked during every build. Public address: https://johnvexcoder.github.io/google1c03abb64b8da92a.html. The owner must click VERIFY in Search Console personally. Keep the file in future builds.

Rollback reference: portfolio-v1-before-v2-2026-10-10 (last live V1 source). A source ZIP is also retained locally in the task outputs. For an approved rollback, restore that snapshot with a new commit (do not force-reset shared main) and switch Pages back to its former legacy main/root source, or publish its verified static content through a reviewed workflow. No rollback was automatically performed.

GitHub guidance: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
