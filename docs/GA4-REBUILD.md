> Current-source update, 13 October 2026: `/home/j0hn/Projects/My-Portfolio-v2` is now the standalone deployment repository. The inherited-parent and separate-Codex-checkout statements below are historical records of the earlier rebuild. Do not use those old locations for current development.

# GA4 and privacy consent rebuild — 12 October 2026

Local implementation and validation are complete. **Release QA is not fully passed:** actual Google request behavior and the property's Enhanced Measurement settings remain unverified. No commit, push, or deployment was made for this rebuild.

## Audit and repository boundary

The inspected OpenCode implementation corresponds to existing commit `14b2919d5abd33af658384159ebe84bbccd7c516`. That commit was already present; this rebuild did not create it. Its production build loaded Google's script before a choice, used denied Consent Mode instead of blocking the tag, allowed events whenever `gtag` existed, and enabled URL passthrough. Automatic page tracking was not sanitized. Privacy controls did not provide reliable withdrawal or owned-cookie cleanup. The modal exposed the public measurement ID and overstated the absence of personal information. `contact_form_submit` described opening an email draft as a submission.

Useful delegated link attributes, the native dialog, stored consent key, and Web3Forms' verified success guard were retained.

`/home/j0hn/Projects/My-Portfolio-v2` is the editable source folder. Git discovery resolves it to the unrelated `/home/j0hn/Projects` repository. It is **not** the deployment checkout. Do not stage or publish through that parent repository.

The independent deployment checkout is `/home/j0hn/Documents/Codex/2026-10-11/s/work/portfolio-release`, with origin `https://github.com/johnvexcoder/johnvexcoder.github.io.git`, branch `main`, and `.github/workflows/deploy-pages.yml` (“Deploy Portfolio V2 to GitHub Pages”). That checkout was left clean and unchanged by this rebuild. The workflow and static-export configuration were preserved. A later approved release must compare and copy only the reviewed source changes into the correct checkout; do not overwrite newer or unrelated work.

The previously approved SEO deployment was separately verified at commit `af2fcb1e8a652f9170e8410fd63dc1815771decd`, Actions run `38150077555`. Its rollback source/export and deployment evidence are in the task's `outputs` directory. This does not imply that a later independently published version still equals that commit.

## Architecture and consent lifecycle

- `lib/analytics-config.mjs` holds the public measurement ID `G-11E1T1HREX`, allowed production origin, consent storage key, script ID, cookie prefix, and public project route/title catalog. The ID is configuration, not an authentication credential, and is absent from visitor-facing privacy copy.
- `lib/analytics.ts` owns a single consent/controller instance, subscription store, strict event allowlists, tag initialization, sanitized page views, and withdrawal. Its injectable window boundary permits isolated tests without Google traffic.
- `components/GoogleAnalytics.tsx` subscribes to consent and `usePathname`, initializes only after acceptance, and delegates known click/details interactions. Effect cleanup prevents duplicate handlers. The root layout no longer emits a bootstrap or Google script before consent.
- Unknown or declined consent produces no GA queue, script, initialization, or custom events. A valid choice uses the existing `j0hnvexcoder-analytics-consent` local-storage key with `granted`/`denied` values; older valid choices still work. Storage failure falls back to the current document's memory and asks again after refresh. Cross-tab withdrawal/reset stops tracking.
- Acceptance queues consent and configuration, disables advertising signals, uses host-only prefixed cookies, appends one asynchronous tag, and sends one manual initial `page_view`. Repeat initialization and query/hash changes do not add views. A different public pathname adds one view; returning to a previous route counts as a new navigation.
- Withdrawal first sets Google's `ga-disable-G-11E1T1HREX` flag synchronously. Helpers then refuse events/navigation tracking, remove the owned script, clear its queue, expire owned cookies, and reload the current URL when the integration had initialized. No denied-consent ping is deliberately sent. Reload terminates the already loaded library's timers; it cannot recall data already sent or a request already in flight.
- Cookie cleanup is scoped to `j0portfolio_ga` / `j0portfolio_ga_*` and known legacy `_ga` / `_ga_11E1T1HREX` cookies. It does not clear theme storage, other local-storage entries, or other properties' cookie names. The legacy `_ga` belongs to this portfolio's previous tag; reassess its ownership if a second integration is ever introduced.
- Analytics only runs in a production build on the exact `https://johnvexcoder.github.io` origin. Development, localhost static exports, and alternate previews keep consent controls functional but never load the real tag or send test events to this property.

Page locations and titles come from the public route catalog, not form fields, `document.title`, arbitrary paths, query strings, or fragments. Unknown paths map to the fixed 404 route. External referrers are reduced to HTTP(S) origins. Events accept only documented names, keys, project IDs, and enum values; unknown keys/values are dropped. No visitor form values or outbound destination URLs are passed to analytics.

## Consent interface and visual review

The floating banner uses the existing palette, typography, restrained borders and shadow. Desktop choices have equal 44px targets; small screens use equal-width choices, with natural wrapping at 320px. It reserves no document flow space. Safe-area offsets and reduced-motion rules are scoped to the consent UI.

The privacy panel is 540px maximum width and 740px maximum height, constrained further by viewport and safe areas. A readable scrolling body sits between a fixed heading/close control and visible consent controls. Plain-English copy explains optional analytics, cookies/storage, technical information Google may process, contact/review behavior, withdrawal, and Google's privacy link. Footer **Privacy Settings** reopens it at any time.

Native modal behavior, accessible names/descriptions, focus trapping, Escape, scroll locking, and focus restoration are supported. Browser checks confirmed focus returns to Privacy details on dismissal and to Privacy Settings when the banner's opener disappears after a choice.

Visual defects found and fixed: the generic `.dialog` rule initially overrode the new width/height; the scoped selector now takes precedence. No clipping, overlap within the panel, missing controls, or horizontal overflow was found at 1440×900, 768×1024, 390×844, 320×568, or 844×390. On a 320px display “Accept Analytics” wraps to two lines; both choices remain equal height (about 56px). Long privacy text requires scrolling on small screens, while choices and close stay available. The floating banner necessarily covers some underlying content until dismissed. Physical-device safe-area/virtual-keyboard and actual assistive-technology testing were not performed; these are browser viewport and accessibility-tree checks.

## Events and compatibility

| Event | Allowed parameters | Meaning |
| --- | --- | --- |
| `page_view` | fixed `page_location`, `page_title`, sanitized `page_referrer` | Initial accepted visit or changed public route |
| `contact_email_click` | `location` | Existing email-contact intent; exact production name preserved |
| `project_demo` | `project`, `action`, `location` | Live/local/self-hosted demo link click |
| `project_reference` | `project`, `action`, `location` | Repository, documentation, or releases click |
| `project_explore` | `project`, `action`, `location` | Case-study link or archive details expansion |
| `contact_social_click` | `network`, `location` | Existing public contact-network link click |
| `contact_email_prepare` | `method=email_app` | Email draft prepared; **not** delivery or a successful client inquiry |
| `contact_copy_email` | `location` | Successful email-address copy |
| `resume_download` | `location` | Résumé link click, not proof of completed download |
| `service_enquiry` | allowlisted `service`, `location` | Service contact intent |
| `review_submitted` | allowlisted `service` | Web3Forms response is HTTP-successful and `result.success` is true; review awaits approval |
| `terminal_open` | `location` | Decorative terminal opened |
| `support_click` | `location` | Support link clicked |
| `privacy_open` | `location` | Existing footer privacy-control event, only when analytics was already accepted |

`contact_email_click` remains the existing GA4 key event with **Once per session** counting. No dashboard setting was changed, and no second automatic outbound event is intentionally emitted for the click. Existing demo/reference/contact/review/service/terminal/support/privacy names remain intact.

One explicit semantic correction: the old `contact_form_submit` event is replaced by `contact_email_prepare`, because this form only opens `mailto:`. Emitting both would duplicate intent and retain a false success claim. It is not mapped to the existing email key event and must not be treated as a successfully submitted inquiry. A review submission is separate from a client inquiry. There is currently no verifiable successful inquiry submission to track.

## Manual GA4 configuration before release

In the existing web data stream, turn **Enhanced Measurement off** for this implementation. At minimum its automatic page views/history changes must be disabled; automatic outbound clicks, form interactions, search, and downloads would also bypass this event/URL policy or double-count custom interactions. `send_page_view:false` alone does not disable Enhanced Measurement's history-based page views. Check that no other tag/GTM configuration duplicates the same property.

Keep `contact_email_click` as its existing **Once per session** key event. Do not create an equivalent generic `click` key event or make `contact_email_prepare` a successful-inquiry conversion. Optional event-scoped custom dimensions are `project`, `action`, `location`, `network`, `service`, and `method`; configure only dimensions you need. Advertising signals are disabled in code; review property retention and advertising settings separately according to your preferences.

These dashboard settings were not inspected or changed. Google documents [manual page views and Enhanced Measurement](https://developers.google.com/analytics/devguides/collection/ga4/views), [basic consent blocking](https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic), and [the analytics disable flag and advertising controls](https://developers.google.com/tag-platform/security/guides/privacy).

## Final PASS/FAIL QA report

“FAIL — unverified” is a missing release verification, not an observed implementation failure. Automated simulations are not described as actual Google network tests.

| Requirement | Result | Evidence and limits |
| --- | --- | --- |
| 1. Preserve `contact_email_click`, avoid duplicate key events | **PASS locally** | Exact original attribute/name retained; a dedicated test asserts one queued event and unchanged parameters per invocation. Delegated handler has cleanup. Existing Once per session dashboard setting is user-confirmed and untouched. Actual property receipt remains part of external verification. |
| 2. Confirm source/deployment relationship; no unrelated overwrite or publication | **PASS** | Separate source parent and deployment Git roots/origin confirmed; release checkout clean. Workflow, dependencies, content, SEO utilities, animations, and project routes unchanged. No rebuild commit/push/deployment. |
| 3. Withdraw after Google's script has actually loaded; no later requests | **FAIL — unverified** | Controller and loaded-library stand-in tests pass: disable flag, scoped cookies, tag removal, queue cleanup, reload, no subsequent navigation/custom collection. Real Google loaded-tag/network behavior was not exercised; localhost deliberately blocks it. User confirmed no separate GA4 test property is available. |
| 4. Exactly one initial and one navigation page view including Enhanced Measurement | **FAIL — external verification outstanding** | Local tests pass for one config/tag/initial view and `/` → archeon → `/` yielding three views, with query/hash/repeated-effect duplicates suppressed. Stream's Enhanced Measurement settings and actual received events were not verified. Manual settings above are required. |
| 5. Actual desktop/tablet/narrow-mobile screenshots | **PASS** | Six browser captures at 1440×900, 768×1024, 320×568 in the task's `outputs` directory, named `ga4-consent-{desktop,tablet,narrow-mobile}.jpg` and `ga4-privacy-{desktop,tablet,narrow-mobile}.jpg`. |
| 6. Visual review as well as tests | **PASS for inspected browser views** | Screenshots reviewed; compact-sizing cascade defect fixed. No horizontal overflow; controls remain usable in portrait/landscape. 320px wrapping and small-screen scrolling documented above. Not a physical-device or screen-reader certification. |
| 7. Separate contact intent from successful inquiries | **PASS** | Mailto form remains unchanged; draft event truthfully named. No successful-inquiry claim. Review event stays after Web3Forms' verified success response; no live form/test review was submitted. |

All 37 automated tests pass, including 15 analytics-specific tests. ESLint, TypeScript, production build, SEO and static-export checks pass. SEO validation covers 20 content pages, 783 internal links, 635 fragments and 80 schema nodes. Export validation covers 21 routes, 581 local references and zero Google tag references in static HTML. Browser static-export checks confirmed first-visit prompt, accepted/declined persistence, footer changes, dialog keyboard/focus behavior, archeon search/case navigation, no broken loaded case images and no captured JavaScript warnings/errors.

All 20 pages' titles, metadata, canonical URLs, image attributes and structured data match the previously verified SEO export. Sitemap, robots and Search Console verification content match byte-for-byte. ProfilePage, Person aliases and Breadcrumb data remain intact.

Performance evidence is limited to code/loading review, successful export checks and bundle sizes. No UI library/dependency was added; the Google tag is asynchronous and excluded before consent. Current union of scripts referenced across the homepage/cases is 733,672 raw / 228,546 gzip bytes, versus the verified pre-analytics SEO baseline's approximately 697,641 raw / 217,518 gzip bytes. This roughly 11KB gzip increase includes the consent UI, controller and public route catalog; it is not a one-page transfer metric. No Lighthouse/Core Web Vitals score or layout-shift measurement is claimed.

Validation logs are in `/home/j0hn/Documents/Codex/2026-10-11/s/work/GA4-{LINT,TYPECHECK,TEST,BUILD,SEO,EXPORT}.txt`; independent SEO preservation evidence is `outputs/GA4-REGRESSION-RESULT.json`. No production analytics test visits, mail drafts, or review submissions were deliberately sent.

## Changed files

Implementation/documentation: `app/globals.css`, `app/layout.tsx`, `components/ConsentBanner.tsx`, `components/Contact.tsx`, `components/Dialog.tsx`, `components/Footer.tsx`, `components/GoogleAnalytics.tsx`, `components/Projects.tsx`, `components/PrivacySettings.tsx` (new), `lib/analytics.ts`, `lib/analytics-config.mjs` (new), `scripts/check-export.mjs`, `tests/analytics.test.mjs`, `README.md`, and this new report. Validation regenerated `docs/SEO-CHECKS.json` and `docs/EXPORT-CHECKS.json`. Build output and task evidence are not source publication files. No package, lockfile, workflow, sitemap generator or robots generator was changed.

## Local checks and release readiness

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run check:seo`, and `npm run check:export`. Then start the export with `PORT=3007 npm start`. Use a fresh local origin/site-data profile for the unknown-consent scenario. Check both choices across refreshes and reopen Privacy Settings. Local consent acceptance intentionally does not load Google; do not remove the hostname guard just to test the production property.

Before a future approved release, verify the dashboard settings and use a separate test property or an explicitly authorized, identifiable production test to observe actual request counts after load, navigation and withdrawal. That verification must cover queued/in-flight events and a refreshed declined document. No such traffic was sent in this rebuild.

**Readiness:** locally built and reviewable; not yet fully release-verified. Publishing awaits a separate explicit approval, with requirements 3 and 4 above still outstanding.
