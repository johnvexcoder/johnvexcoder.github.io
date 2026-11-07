"use client";
import { useEffect } from "react";
import FAQMotion from "./FAQMotion";
import { usePathname } from "next/navigation";

/** Settled server HTML is the fallback. One observer owns finite page enhancement. */
export default function PremiumPageMotion({
  density = "editorial",
}: {
  density?: string;
}) {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      density === "home"
        ? "#main"
        : ".services-page, .case-study, .editorial-page",
    );
    if (
      !root ||
      typeof root.animate !== "function" ||
      typeof IntersectionObserver === "undefined"
    )
      return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const animations = new Set<Animation>();
    const seen = new WeakSet<Element>();
    const easing = "cubic-bezier(.22,1,.36,1)";
    let disposed = false;
    let idle: number | undefined;
    const allowed = () =>
      !disposed &&
      !preference.matches &&
      !connection?.saveData &&
      !document.hidden;
    const play = (
      element: HTMLElement | SVGElement,
      keyframes: Keyframe[],
      duration: number,
      delay = 0,
    ) => {
      if (
        !allowed() ||
        element.contains(document.activeElement) ||
        element.closest("form, .review-dialog-backdrop")
      )
        return;
      const animation = element.animate(keyframes, {
        duration,
        delay,
        easing,
        fill: "none",
      });
      animations.add(animation);
      animation.finished
        .then(() => animations.delete(animation))
        .catch(() => animations.delete(animation));
      return animation;
    };
    const selector = [
      "[data-service-illustration]",
      ".section-heading",
      ".profile-section-heading",
      ".capability-ledger > section",
      ".experience-ledger li",
      ".profile-evidence-grid > a",
      ".availability-strip",
      ".consultation-note",
      ".service-card",
      ".premium-service",
      ".selected-work-card",
      ".service-detail-body section",
      ".service-scope",
      ".engineering-steps > li",
      ".service-engineering-heading",
      ".engineering-inputs",
      ".verification-grid > div",
      ".service-care",
      ".service-faq",
      ".service-cta",
      ".service-navigation",
      ".service-process > div > div",
      ".case-story section",
      ".case-story aside",
      ".case-pagination",
      ".case-media",
      ".project-narrative",
      ".archive-toolbar",
      ".skill-group",
      ".timeline-entry",
      ".independent-work",
      ".about-copy",
      ".contact-copy",
      ".services-home-footer",
      ".testimonial-viewport",
    ].join(",");
    const candidates = [...root.querySelectorAll<HTMLElement>(selector)].filter(
      (element) => {
        const ancestor = element.parentElement?.closest(selector);
        return (
          !element.closest("#home, form") &&
          (!ancestor || !root.contains(ancestor))
        );
      },
    );
    const observer = new IntersectionObserver(
      (entries) => {
        if (!allowed()) return;
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          const element = entry.target as HTMLElement;
          seen.add(element);
          observer.unobserve(element);
          element.setAttribute("data-motion-entered", "");
          if (element.matches("[data-service-illustration]")) {
            // Animate the outer frame once; nested panels assemble independently only inside it.
            const parts = [
              ...element.querySelectorAll<HTMLElement | SVGElement>(
                "[data-assembly]",
              ),
            ];
            for (const [index, part] of parts.entries()) {
              const connectionPart =
                part.getAttribute("data-assembly") === "connection";
              play(
                part,
                connectionPart
                  ? [
                      { opacity: 0.5, transform: "scaleX(.75)" },
                      { opacity: 1, transform: "scaleX(1)" },
                    ]
                  : [
                      {
                        opacity: 0.7,
                        transform: `translateY(${index ? 9 : 14}px) scale(.985)`,
                      },
                      { opacity: 1, transform: "translateY(0) scale(1)" },
                    ],
                460,
                Math.min(index * 55, 440),
              );
            }
            continue;
          }
          const card = element.matches(
            ".service-card, .premium-service, .selected-work-card, .skill-group, .profile-evidence-grid > a, .engineering-steps > li, .verification-grid > div",
          );
          const ledger = element.matches(
            ".timeline-entry, .experience-ledger li, .service-process > div > div",
          );
          const index = element.parentElement
            ? [...element.parentElement.children].indexOf(element)
            : 0;
          play(
            element,
            [
              {
                opacity: 0.65,
                transform: card
                  ? "translateY(20px) scale(.975)"
                  : ledger
                    ? "translateX(-16px)"
                    : "translateY(10px)",
              },
              { opacity: 1, transform: "translate(0,0) scale(1)" },
            ],
            density === "compact" ? 240 : 360,
            card || ledger ? (index % 3) * 45 : 0,
          );
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -16px 0px" },
    );
    const register = () => {
      if (allowed())
        for (const element of candidates)
          if (!seen.has(element)) observer.observe(element);
    };
    // Keep enhancement setup out of initial hydration; no initial hidden classes are needed.
    const idleSupported = typeof window.requestIdleCallback === "function";
    if (idleSupported)
      idle = window.requestIdleCallback(register, { timeout: 1200 });
    else idle = window.setTimeout(register, 80);
    const cancel = () => {
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    const preferenceChange = () => {
      if (!allowed()) {
        cancel();
        observer.disconnect();
      } else register();
    };
    const visibilityChange = () => {
      if (document.hidden) cancel();
      else register();
    };
    const focus = () => {
      for (const animation of animations) {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (
          target instanceof Element &&
          target.contains(document.activeElement)
        )
          animation.cancel();
      }
    };
    root.addEventListener("focusin", focus);
    // FAQMotion owns native disclosure feedback.
    preference.addEventListener("change", preferenceChange);
    document.addEventListener("visibilitychange", visibilityChange);
    return () => {
      disposed = true;
      observer.disconnect();
      cancel();
      if (idle !== undefined) {
        if (idleSupported) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
      root.removeEventListener("focusin", focus);

      preference.removeEventListener("change", preferenceChange);
      document.removeEventListener("visibilitychange", visibilityChange);
    };
  }, [pathname, density]);
  return <FAQMotion />;
}
