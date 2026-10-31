# Signature design system — enhancement, 31 October 2026

The established technical/editorial world remains authoritative: dark navy surfaces, cool blue/cyan accents, Adwaita-derived locally hosted Signature fonts, a transparent portrait, generous editorial spacing, measured browser frames and real project screenshots. The identity remains **From interface to infrastructure**. The light theme remains supported.

## Visual language

Use the existing --bg, --surface, --surface2, --text, --soft, --muted, --blue and --cyan tokens. Retain the 8px spacing basis, clamp-based gutters and original heading hierarchy. Prose stays readable and constrained; short display headings use balanced wrapping. Technical labels, code and measurements use SignatureMono. Do not replace the fonts with a dataset recommendation or add generic gradients, floating particles, mock statistics or another design system.

UI UX Pro Max's initial automatic style lookup returned a documentation/FAQ pattern, which does not match this portfolio. Its targeted interaction, accessibility and Next.js guidance is used; its unrelated palette/font/layout recommendation is rejected. Impeccable's preservation and polish workflow is applied directly to source and rendered evidence. Existing brand decisions take priority over its general stylistic preferences. The launcher did not execute, so no automatic detector result or formal independent critique is claimed.

## Motion ownership

- Hero/network: existing CSS/network coordinator; identity arrives within 380–720ms while the network continues its original 3.6s story. Content is visible from first paint; CTA order and words remain intact.
- Page/section entrances: PremiumPageMotion and Reveal. Already-visible defaults, one-shot observation, cleanup and reduced-motion cancellation remain.
- Screenshot image: Preview owns one WAAPI transform. Paused offscreen, in hidden documents, under reduced motion or during manual exploration/focus/touch. Travel rate depends on measured overflow.
- Filtered rows: useProjectLayout captures positions only for deliberate pointer category changes. Surviving visible rows use a 220ms FLIP translation. Search typing, clear/reset and keyboard-driven changes stay immediate. New rows retain the page coordinator's entrance ownership.
- Navigation: native CSS scroll-timeline draws a quiet 2px progress line where supported; no extra scroll listener. Reduced motion hides it.
- Feedback: exact-property CSS transitions, 160ms feedback, 220ms layout; fine-pointer-only service icon movement. Native scrolling, browser history and focus controls remain authoritative.

GSAP's official lifecycle and performance guidance and Emil Kowalski's review/performance skills inform property choice, batching, interruption and cleanup. The existing Web Animations API is sufficient, so neither GSAP nor React Bits/Magic UI is added at runtime. Existing topology node controls and service/skill/experience choreography are retained rather than duplicated.

## Acceptance

Verify 375, 430, 768, 1024, 1440 and 1920px, both themes, reduced motion, keyboard and touch. Check filtered empty states, resize, back/forward, screenshot manual exploration, no-JavaScript content and analytics consent. Automated accessibility results supplement visual inspection; they are not WCAG certification.
