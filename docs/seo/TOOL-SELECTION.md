# Tool selection — 31 October 2026

| Tool | Purpose | State / compatibility | Cost | Security and justification |
| --- | --- | --- | --- | --- |
| Existing Node tests, TypeScript, ESLint | Source regression checks | Existing Next.js pipeline, executed | Free | Local, no account; retains established tests |
| parse5 + static SEO/export scripts | All-route metadata, links, schema and asset validation | Existing, extended; Pages-compatible | Free | Inspects generated HTML without running page scripts; CI already runs these checks |
| FontTools | Smaller self-hosted font coverage | Workspace-only asset-authoring tool; generated files committed, not required at runtime | Free | Local processing; same typefaces, source glyph coverage asserted, originals/licenses retained |
| sharp | Genuine screenshots, responsive WebP, portrait and icons | Existing build utility, executed | Free | Local image processing; original captures retained |
| Playwright | Demo verification and responsive/interaction tests | Already installed, executed in isolated headless Chromium | Free | Local test profiles; no real form submissions or authentication |
| axe-core Playwright adapter | Accessibility smoke checks | Already available development tool, executed against export | Free | Local DOM analysis; no cloud upload, not certification |
| Lighthouse | Repeatable lab mobile/desktop measurements | Already installed, executed with explicit desktop config and default mobile config | Free | Local reports; no third-party result upload; medians rather than brittle score gates |
| Context7 MCP | Current library documentation | Project configuration added; activation/authentication may require reopening project | Free tier subject to provider limits | No key committed; official docs used directly this session |
| UI UX Pro Max / Impeccable / GSAP / Emil skills | Preservation, design and motion review | Requested project-local skill families installed; relevant guidance read | Open-source, no paid plan | Reviewed official README/licenses; no global hooks; irrelevant installer extras removed |
| Public production crawl | Actual HTTP statuses and initial HTML | Read-only audit of every sitemap/local content route | Free | No credentials, analytics exports or production mutations |
| Existing web-vitals integration | Optional local diagnostics / field instrumentation | Preserved existing consent and diagnostic behavior | Free | No new collection, tracking or analytics event added |

## Evaluated, not added

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci): compatible optional future report job. Existing regression checks already run in Pages CI. No new deployment workflow, public report upload or unstable score threshold is introduced.
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp): optional duplicate of available browser/CDP and Lighthouse capabilities; not required for this pass.
- [Codex SEO candidate](https://github.com/AgriciDaniel/codex-seo): the supplied URL now redirects to chatgpt-seo. Reviewed its current destination rather than running a stale installer. Existing tested audits plus official Google guidance cover this task.
- [Marketing skills](https://github.com/coreyhaines31/marketingskills): useful planning references, but overlapping installation is unnecessary; no marketing automation is added.
- [Google Developer Knowledge MCP](https://developers.google.com/knowledge/mcp) and [Google skills](https://github.com/google/skills): official documentation access was evaluated. Direct Google Search Central/web.dev sources suffice; no new cloud project, billing or API key is needed.
- Search Console/API and GA4 reports: no authorized reporting session or export available. Manual/read-only access procedure documented. No invented private metrics.
- PageSpeed Insights / CrUX: public field data is distinct from these local lab runs. No authenticated API/key or sufficient field dataset was obtained. Use production PSI/GSC after approved publication.
- Google Rich Results Test / Schema.org Validator: appropriate post-publication checks. Local syntax, graph shape and identity checks run for every route; remote eligibility validation is not asserted for unpublished pages.
- Unlighthouse, Screaming Frog and WebPageTest: alternatives, not necessary alongside the existing all-route parser and browser checks. No accounts, paid plans or external performance uploads created.
- React Bits, Magic UI and shadcn MCP: evaluated for reuse, not added; the existing design and motion architecture already supplies the requested patterns.
- Bundle analyzer: static-export script union and actual network reports give useful measurements without an additional analysis package. Union bytes are labeled separately from one-page transfers.
