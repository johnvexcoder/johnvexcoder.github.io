# Security and deployment notes — 1 November 2026

Hosting remains GitHub Pages. Its response-header controls are limited: a metadata tag cannot replace HSTS, a complete response CSP, Permissions-Policy or arbitrary per-path headers. No hosting/DNS migration or scanner-grade claim is made. A restrictive CSP was not introduced without end-to-end support for the existing CAPTCHA, consented analytics and review/contact providers.

The application has no new production package dependency. Production dependency auditing is separate from the isolated developer package; the latter has documented advisories in docs/codex/tool-evaluation.md and is not copied into the static website. Browser profiles, caches, tool reports, node_modules, environment files, private Search Console exports and the private consolidation note are excluded from publication.

Contact delivery retains enabled Formspree hosted spam verification; reviews retain their separate provider. No CAPTCHA secret, invented public key, disabled protection or paid account change is used. The portrait world is a conceptual visual using local geometry and existing local glyphs; it does not transmit or display private live telemetry. External project links retain safe new-tab relations where applicable. JSON-LD serialization escapes HTML-sensitive delimiters; form/provider text is rendered as text rather than injected HTML.

The consent-aware analytics implementation remains opt-in, with fixed event/page fields and no inquiry names, email addresses, message content or arbitrary URL queries. Hosted Formspree acceptance cannot be observed as a confirmed local success event, so no success is inferred from a button click or query parameter.

Build/export checks reject public .map files and sourceMappingURL references, and verify local links, generated content and canonical indexing output. The existing GitHub verification file and .nojekyll deployment behavior are retained. The supplied résumé is deliberately public under the owner's exact filename and is verified byte-for-byte against the requested document. Full project captures are retained; directory/evidence tiles use generated still crops to limit image-decoding cost.

The final staged-source/diff review and production URL checks occur after implementation gates pass. Commit/deployment identifiers and measured limitations are recorded in the delivered release report. Authenticated Search Console processing, field Core Web Vitals and physical-device behavior cannot be inferred from a local build or scanner score.
