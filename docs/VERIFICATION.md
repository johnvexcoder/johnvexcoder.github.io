# Portfolio V2 — verification record

Validated locally on 10 October 2026. No public deployment, remote push or DNS change was performed.

This is the original visual-development verification record. The subsequent SearchEdge implementation has its current 22-test and expanded SEO/link results in `SEO-AUDIT.md`; its specific evidence files use the `SEO-` prefix.

## Build and automated checks

- Production build: successful Next.js static export, 25 generated entries including 18 project pages and the custom 404.
- TypeScript: no errors.
- Automated tests: **18 passed, 0 failed, 0 skipped** on the development machine. Tests cover retained source content/assets, source hashes, intro timing/session/fallback behavior, genuinely redundant network routes, bounded and reversible scroll assembly, screenshot continuation and bidirectional feedback wrapping.
- Export audit: **20 HTML routes**, including `/404/`, and **466 local references** checked. The error page and fallback both contain the custom experience and error title.
- SEO audit: **19 content pages** with unique titles/canonicals, absolute sharing-image URLs, actual 1200×630 images, structured data and an image sitemap. The 404 is excluded from the sitemap and uses noindex.
- See `BUILD-RESULTS.txt`, `TEST-RESULTS.txt`, `TYPECHECK-RESULTS.txt`, `EXPORT-CHECKS.json` and `SEO-CHECKS.json` for evidence.

The script-size report is the union across all audited routes, not the download size of one page or a Lighthouse measurement.

## Rendered browser checks

The actual application was exercised through the Codex in-app browser on the approved local port, 3003. Screenshots were captured from the rendered page, not generated mockups.

| Viewport  | Result                                                                |
| --------- | --------------------------------------------------------------------- |
| 360×800   | No horizontal overflow; centered portrait above wordmark; actions fit |
| 390×844   | No horizontal overflow; centered portrait above wordmark; actions fit |
| 430×932   | No horizontal overflow; centered portrait above wordmark; actions fit |
| 768×1024  | No horizontal overflow; centered portrait above wordmark; actions fit |
| 1024×900  | No horizontal overflow; centered portrait above wordmark; actions fit |
| 1366×768  | Taller visual scene; no horizontal overflow; all actions fit          |
| 1440×900  | No horizontal overflow; centered portrait above wordmark; actions fit |
| 1440×1000 | No horizontal overflow; centered portrait above wordmark; actions fit |
| 1920×1080 | No horizontal overflow; centered portrait above wordmark; actions fit |

The hero fills the screen below navigation at all nine checked sizes. At the requested 1366×768 size, the visual scene is approximately 17% taller and the portrait approximately 12% taller, while the full composition still fits the first screen. Its actual portrait is centered at half the document width, with z-index 2 above branding at z-index 1. The requested philosophy is in About with visible opening/closing quotation marks, champagne accents and blue-white text, and absent from Hero. The portrait now uses an image-bound lower-edge mask instead of a separate stage overlay; its fade stays continuous when the stage becomes shorter. Final measurements and images are included in the visual evidence package.

### Intro

- Captured a desktop sequence of 20 real frames and a mobile sequence of 12 frames. They show the initial network, amber fault, node movement/new routing, stable structure and hero emergence.
- These storyboard captures precede the final portrait fade and short-desktop height refinement; the dedicated final Hero screenshots show the finished layout.
- Correct starting geometry now renders before hydration: actual computed node coordinates begin at 170/90 and 350/90, travel through intermediate positions, and finish at 90/100 and 300/55.
- The same SVG remains as the hero background. The original vulnerable edge is absent from the final resilient graph; desktop and essential mobile graphs maintain a route around the fault after any single edge removal.
- Escape after initialization and the Skip Intro control reveal the hero. The first-paint bootstrap also handles Escape and link/button/input interaction before hydration.
- A refresh in the same session shows the settled hero. Internal case-page navigation does not replay the intro.
- Pure bootstrap tests verify reduced-motion skipping, storage-failure recovery and the 4.2-second fallback. CSS completes the visual sequence without hydration.
- No animation overlay blocks interaction; no hydration or application errors were observed during successful local preview checks.

### Projects, search and previews

- Category results: CLI 2, Infrastructure 3, Software 1, Web 12, All 18. Featured returns 9. Searching “shoes” returns the actual Shoes on the Go entry; unmatched terms expose reset/recovery.
- Desktop and mobile search layouts were visually reviewed: icon/input share a single boundary, the focus ring encloses the field, and Featured aligns alongside it at a matching height.
- Long screenshots pan only with meaningful overflow and visibility. Manual keyboard/wheel exploration pauses automation and resumes from the measured current position. Normal screenshots remain contained and static.
- Case-page links and the real Shoes on the Go capture were verified. The four supplied live project URLs were read-only checked and preserved exactly. Public project destinations are recorded in `LINK-CHECKS.json`; the private MovieFlix destination was not probed.

### Diagram interactions

All four infrastructure selections and all four Professional System selections were clicked. Each retained `motion-ready scene-active` after React updates; the selected paths remained `animation-play-state: running`, with changing dash offsets. Selection changes meaningful source content and highlighted relationships. These are illustrative diagrams, not fabricated live metrics.

### Client feedback

- Hold/hover pauses reading; a paused track remained at an unchanged transform between observations.
- Actual mouse drags moved the same track −320px, then +250px. Horizontal scrolling and focused arrow keys move through the same loop.
- Leaving interaction resumes at the edited position after the grace period; observed transform movement confirmed resumption.
- A vertical wheel gesture moved the page 315px, confirming native page scrolling remains available.
- No carousel or play/pause controls were added. Original five reviews remain accessible; visual clones are aria-hidden. Coverage and wrap seams are tested for variable collection sizes.

### Skills, navigation and forms

- All 28 skill tools are accessible interactive icons. Twenty-six real local brand marks and two appropriate generic icons replace visible tool-name chips. A clicked React icon showed its label/pressed state; hover/focus/tap feedback is available.
- Mobile menu and keyboard quick navigation were exercised, including Escape, focus wrapping and navigation. Theme switching works.
- Contact and review empty-form validation were exercised without sending. Contact opens a mail composer; provider-backed reviews retain consent, CAPTCHA and moderation. No real message or review was submitted.
- The bounded decorative terminal and résumé/profile destinations were checked.

### Custom 404

- `/404` and `/404/` expose the reusable animated React/SVG recovery experience. Unknown paths use the same experience with HTTP 404.
- The actual original `My-Portfolio/404.html` was inspected before designing the new version; it was not modified.
- “Trace a new route” triggers a bounded illuminated route/pulse, disables repeated triggering until completion and updates accessible status text.
- Real project search finds Shoes on the Go and opens its correct case page. Empty results offer the full collection. Home/contact recovery remains available.
- Desktop and mobile screenshots were reviewed; mobile has no horizontal overflow. Ambient effects pause offscreen and reduced-motion CSS provides a static alternative.
- Both exported error documents use the dedicated 404 title and noindex metadata. Static hosts must serve `/404.html` with HTTP 404 for unknown routes.

## Source integrity and attribution

`SOURCE-VERIFICATION.json` records **498 unchanged original file hashes**, zero changed files and zero removed files. The only added reference file is the Shoes on the Go image supplied by the owner after discovery. Existing original portraits, project imagery/marks, résumé, source records, local fonts and five reviews were reused. Four categories and all fourteen original projects were retained; four owner-confirmed live projects bring the total to eighteen.

No source screenshots exist for Nexora Agent, Python-Keybr or DistroZSH. Their explicit interface illustrations remain honest fallbacks. Skill logo/font notices and the local source manifest are included in `public/licenses/` and `SKILL-ICON-SOURCES.json`.

## Limits of these checks

- Browser viewport checks are responsive desktop simulation, not physical-phone testing. Physical touch gestures and midrange-device 60FPS were not measured.
- OS-level reduced-motion behavior is implemented and bootstrap-tested; the available browser controls did not provide OS preference emulation.
- No Lighthouse score, full assistive-technology audit, or public Google ranking/indexing result is claimed.
- CAPTCHA/provider delivery needs the approved public domain and provider configuration; it was not tested by submitting a real review.
- Google indexing and rich results cannot be guaranteed. Set the exact approved `NEXT_PUBLIC_SITE_URL` before publishing, then verify Search Console and sitemap/image availability on the public domain.

## Handoff

The source and static export are ready for review and later approved hosting. `README.md` includes exact local commands and Vercel/Hostinger configuration. Development dependencies and caches are excluded from the source archive. Owned preview processes are stopped after verification. The user’s existing development preview is left available; no public deployment is performed.
