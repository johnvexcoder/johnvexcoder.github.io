# Motion performance strategy — 1 November 2026

Primary: Chrome DevTools traces plus Emil animation-performance/review/improve guidance. Supporting: Playwright, mobile-native and existing GSAP guidance only if a real GSAP timeline need is established.

Before changing motion, preserve the current static build and record loading and reproducible scrolling separately. Capture desktop/mobile, normal/reduced motion, fast/slow/reversing scroll and repeated navigation. Save CPU throttling, viewport, browser/version, trace boundaries and durations. Count long tasks, layout/style work, forced layout events and compositor frame evidence; do not convert rAF intervals or Lighthouse scores into an asserted physical-device FPS guarantee.

Source candidates observed during discovery: scroll scheduling in Header/SceneMotion, a requestAnimationFrame loop in NetworkScene, CSS reveals and native/WAAPI screenshot preview motion. Their existence alone is not a diagnosis. Profile callbacks, cached geometry, offscreen/document-hidden lifecycle and resize handling before selecting fixes. Check oversized image/compositing work and simultaneous visible previews. Native scroll/history/touch must stay intact.

Use CSS/IntersectionObserver for simple reveals, transform/opacity for animation, bounded and cleaned-up listeners, no unnecessary pinning or scroll hijack. Respect reduced motion and leave meaningful static content visible without JavaScript. Test context remounting and back/forward for leaked listeners/observers/animation objects. Memory tools are available; compare equivalent settled navigation states and distinguish retained cache from a leak.

Browser emulation and CPU throttling are available. Physical phone hardware, mobile Safari keyboard/safe-area behavior and end-user field INP remain unverified until such evidence is supplied.
