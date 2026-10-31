# Performance comparison — 31 October 2026

Medians from three independent Chromium/Lighthouse runs per device and build. Both exports use the same local gzip-serving implementation. The preserved original export matches all 15 initial baseline script resources by name and byte length. Desktop uses the explicit Lighthouse desktop configuration; mobile uses its default simulated mobile configuration.

| Device | Performance, before → after | LCP, before → after | TBT, before → after | CLS | Transfer, before → after |
| --- | --- | --- | --- | --- | --- |
| Mobile | 69 → 78 | 5.49s → 3.84s | 449ms → 421ms | 0 → 0 | 1129KB → 729KB |
| Desktop | 99 → 100 | 0.89s → 0.75s | 7ms → 10ms | 0 → 0 | 1036KB → 715KB |

| Category | Baseline | Optimized |
| --- | --- | --- |
| accessibility (both device medians) | 90 | 100 |
| best-practices (both device medians) | 100 | 100 |
| seo (both device medians) | 100 | 100 |

## Interpretation

The individual-run ranges are recorded in PERFORMANCE-MEASUREMENTS.json. Mobile LCP improves by about 30% and measured transferred bytes fall by about 35%, despite adding six projects. Mobile TBT remains substantial at about 421ms (baseline about 449ms); the change is small relative to run variance. CLS remains zero in these runs. Accessibility improves from 90 to 100; best practices and SEO are 100 in the final runs. These scores do not establish WCAG certification, Google indexing or improved rankings.

The mobile ≥90 and LCP ≤2.5s objectives are **not met** in this simulated test. Remaining long tasks are primarily framework/RSC decoding, hydration and style/rendering work on a long, interactive homepage. A selective-hydration experiment was removed after the no-JavaScript smoke check found hidden streaming containers. The final build renders those sections directly and checks against hidden ancestors. A deeper client-island refactor or further critical-path profiling should be evaluated as a separate measured change, without removing the portfolio’s motion, useful content or existing features. No real-user INP was obtained; TBT is not presented as INP.

## Asset and code changes

The six PNG captures total 24,497,637 bytes; their dedicated full-preview WebPs total 2,084,678 bytes (91.5% smaller). These are asset-file totals, not an equivalent percentage reduction in initial page load. Smaller responsive candidates and lazy loading control actual requests. Original captures remain intact. The 640px portrait falls from about 230KB to 40KB with transparency retained. Fonts fall from 202,832 to 128,944 bytes combined, using the same typefaces and verified source-character coverage. Original fonts and licenses are retained.

The union of JavaScript files referenced across all exported routes increases from 237,354 to 247,829 gzip bytes, reflecting the larger catalog and interactions. This union is distinct from a single-page transfer. Case-route prefetching is disabled where speculative navigation would otherwise download unrelated content. No animation runtime is added.

## Measurement limitations

The original uncompressed preview also has a separately recorded baseline (mobile 69–70, desktop 94–96); it is not mixed with this gzip comparison. A preliminary desktop attempt incorrectly retained mobile settings and was excluded. An intermediate optimized run exposed an implicit favicon request returning 404; a genuine brand-derived ICO fixed it, and final best-practices scores returned to 100. Earlier intermediate scores are not substituted for the final runs.

Local compression, loopback latency, system CPU scheduling, fresh test profiles and Lighthouse’s simulation differ from GitHub Pages CDN and visitor devices. One run can vary materially; use the three-run medians and ranges, not the best run. The attached PERFORMANCE-MEASUREMENTS.json records individual runs and settings. Field p75 LCP/INP/CLS and private Search Console metrics remain unavailable. Check production PageSpeed Insights and Search Console after approved publication.
