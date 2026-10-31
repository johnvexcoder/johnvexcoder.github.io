# Motion review — 31 October 2026

Scope: changes in this implementation, reviewed using the installed official GSAP performance/lifecycle and Emil Kowalski review/performance guidance. Existing scene concepts remain part of the portfolio's identity.

| Before | After | Why |
| --- | --- | --- |
| Preview writes scrollTop from requestAnimationFrame | One WAAPI transform with endpoint holds and measured travel | Avoid repeated main-thread scroll writes; pause offscreen/hidden and transfer the current position to native manual scrolling |
| Screenshot source selected at one full width | Measured 480/960/native source candidates | Preserve proportion and legibility while limiting narrow-screen transfers |
| First-visit identity/copy waits behind a 3.6s intro | Visible defaults with short portrait/identity/support/CTA choreography; existing network story continues | Make purpose and actions available immediately without discarding the visual identity |
| Filter rows change position without continuity | 220ms transform for surviving visible rows after pointer category changes | Explain spatial change; typing, reset and keyboard changes stay immediate |
| Workflow text fades continuously | Text remains fully opaque; only the small signal line pulses | Preserve readable contrast while retaining an activity cue |
| Large screenshot controls rely on focus/manual scrolling | Explicit Explore/Finish controls also work under reduced motion; full image link available | Make touch and reduced-motion access understandable without movement being required |

**Performance:** transforms/opacity own new repeated motion; geometry reads precede layout-animation writes. Screenshot promotion is temporary. Observer, timer, animation and media-query listeners clean up on unmount. Native scroll-timeline progression adds no scroll listener. Native smooth return at pointer exit is interruptible; actual screenshot travel remains slow and proportional to image height.

**Interruptibility and timing:** the 160/220ms feedback/layout budgets match occasional UI actions. Marketing entrances may last 380–720ms; the existing 3.6s network sequence is explanatory and skippable, not an input lock. Live search is immediate. The existing small FAQ height animation remains a bounded 220ms disclosure, rather than being replaced solely to satisfy a generic property preference.

**Accessibility:** reduced motion cancels automatic image movement and supplies explicit manual exploration. Hover behavior is mouse-specific; service icon movement is gated to a fine pointer. Keyboard focus pauses preview movement and does not get redirected. New content remains in initial HTML if enhancement fails. Responsive tests cover 375–1920px; no real-device frame-rate or WCAG certification is claimed.

**Decision:** approve the scoped changes subject to the recorded final browser checks. Browser measurements and source lifecycle checks support the implementation; smoothness on a low-power physical handset still deserves a post-publication field check. Impeccable's direct-source polish workflow was used separately; no formal dual-agent critique or automatic detector outcome is implied.
