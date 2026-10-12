"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
/** Progressive motion: initial HTML stays visible; animations never own navigation. */
export default function PremiumPageMotion({
  density = "editorial",
}: {
  density?: string;
}) {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      density === "home" ? "#main" : ".services-page, .case-study",
    );
    if (!root || typeof root.animate !== "function") return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Set<Animation>();
    const faqAnimations = new Map<
      HTMLDetailsElement,
      { animation: Animation; target: boolean }
    >();
    const easing = "cubic-bezier(.22,1,.36,1)";
    const run = (
      element: HTMLElement,
      keyframes: Keyframe[],
      duration: number,
      delay = 0,
    ) => {
      if (preference.matches) return;
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
    };
    const hero = root.querySelector<HTMLElement>(
      ".services-hero, .service-detail-hero, .case-heading",
    );
    const heroElements = hero?.querySelectorAll<HTMLElement>(
      ".eyebrow, h1, .services-lead, p:not(.eyebrow):not(.services-lead), .button, .services-hero-proof",
    );
    if (heroElements)
      Array.from(heroElements).forEach((element, index) =>
        run(
          element,
          [
            {
              opacity: element.tagName === "H1" ? 1 : 0.7,
              transform: `translateY(${element.tagName === "H1" ? 16 : 9}px)`,
            },
            { opacity: 1, transform: "translateY(0)" },
          ],
          density === "compact" ? 280 : 460,
          Math.min(index * 45, 210),
        ),
      );
    const seen = new WeakSet<Element>();
    const registered = new WeakSet<Element>();
    const selector = [
      ".service-card",
      ".selected-work-card",
      ".service-section-title",
      ".service-examples > h2",
      ".service-examples > .eyebrow",
      ".service-examples > p:not(.eyebrow)",
      ".service-detail-body section",
      ".service-scope",
      ".service-process > div > div",
      ".service-process > .eyebrow",
      ".service-process > h2",
      ".service-care",
      ".service-faq",
      ".service-cta",
      ".case-story section",
      ".case-story aside",
      ".case-pagination",
      ".service-navigation",
      ".case-media",
      ".section-heading",
      ".introduction [data-reveal]",
      ".project-narrative",
      ".preview",
      ".project-symbol",
      ".archive-project",
      ".archive-toolbar",
      ".collection-heading",
      ".assembly-bridge",
      ".lab-diagram",
      ".lab-reader",
      ".system-map",
      ".professional-reader",
      ".skill-group",
      ".timeline-entry",
      ".independent-work",
      ".services-list .service",
      ".services-home-footer",
      ".about-photo",
      ".about-copy",
      ".contact-copy",
      ".contact-form-wrap",
      ".testimonial-viewport",
    ].join(", ");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target)) continue;
          seen.add(entry.target);
          observer.unobserve(entry.target);
          const element = entry.target as HTMLElement;
          element.setAttribute("data-motion-entered", "");
          if (element.contains(document.activeElement)) continue;
          const card = element.matches(
              ".service-card, .selected-work-card, .skill-group, .services-list .service",
            ),
            section = element.matches(
              ".case-story section, .service-detail-body section",
            );
          if (card)
            run(
              element,
              [
                { opacity: 0.38, transform: "translateY(22px) scale(.99)" },
                { opacity: 1, transform: "translateY(0) scale(1)" },
              ],
              420,
              (Array.from(element.parentElement!.children).indexOf(element) %
                3) *
                55,
            );
          else if (element.matches(".preview, .about-photo, .case-media"))
            run(
              element,
              [
                {
                  opacity: 0.65,
                  clipPath: "inset(6% 0 6% 0)",
                  transform: "scale(.975)",
                },
                {
                  opacity: 1,
                  clipPath: "inset(0% 0 0% 0)",
                  transform: "scale(1)",
                },
              ],
              480,
            );
          else if (
            element.matches(".section-heading, .service-section-title")
          ) {
            const parts = element.querySelectorAll<HTMLElement>(
              ".eyebrow, h2, p:not(.eyebrow)",
            );
            parts.forEach((part, index) =>
              run(
                part,
                [
                  {
                    opacity: part.tagName === "H2" ? 1 : 0.7,
                    transform: `translateY(${part.tagName === "H2" ? 22 : 10}px)`,
                  },
                  { opacity: 1, transform: "translateY(0)" },
                ],
                420,
                Math.min(index * 60, 180),
              ),
            );
          } else if (
            element.matches(".timeline-entry, .service-process > div > div")
          )
            run(
              element,
              [
                { opacity: 0.4, transform: "translateX(-25px)" },
                { opacity: 1, transform: "translateX(0)" },
              ],
              400,
              (Array.from(element.parentElement!.children).indexOf(element) %
                3) *
                70,
            );
          else if (
            element.matches(".assembly-bridge, .lab-diagram, .system-map")
          )
            run(
              element,
              [
                { opacity: 0.5, clipPath: "inset(0 14% 0 14%)" },
                { opacity: 1, clipPath: "inset(0 0% 0 0%)" },
              ],
              520,
            );
          else if (section)
            run(
              element,
              [
                {
                  opacity: 0.35,
                  transform: `translateX(${density === "compact" ? 0 : -10}px) translateY(8px)`,
                },
                { opacity: 1, transform: "translate(0,0)" },
              ],
              density === "compact" ? 260 : 410,
            );
          else
            run(
              element,
              [
                { opacity: 0.32, transform: "translateY(22px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              density === "compact" ? 300 : 440,
            );
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    const register = () => {
      root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        if (registered.has(element) || element.closest("#home")) return;
        registered.add(element);
        observer.observe(element);
      });
    };
    register();
    // Filtered project rows and technical-reader panels can mount after the first pass.
    const changes = new MutationObserver(register);
    changes.observe(root, { childList: true, subtree: true });
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (footer) observer.observe(footer);
    const focus = () => {
      // Keep focused controls still even when keyboard navigation scrolls their section into view.
      animations.forEach((animation) => {
        const target = (animation.effect as KeyframeEffect | null)?.target;
        if (
          target instanceof Element &&
          target.contains(document.activeElement)
        )
          animation.cancel();
      });
    };
    root.addEventListener("focusin", focus);
    const faq = (event: MouseEvent) => {
      const summary = (event.target as Element).closest(".service-faq summary");
      if (!summary || preference.matches) return;
      const details = summary.parentElement as HTMLDetailsElement;
      const body = details.querySelector<HTMLElement>(".faq-answer");
      if (!body) return;
      event.preventDefault();
      const previous = faqAnimations.get(details);
      const target = previous ? !previous.target : !details.open;
      const currentHeight = body.getBoundingClientRect().height;
      previous?.animation.cancel();
      details.open = true;
      const fullHeight = body.scrollHeight;
      const animation = body.animate(
        [
          {
            height: `${previous ? currentHeight : target ? 0 : fullHeight}px`,
            opacity: target ? 0.5 : 1,
          },
          { height: `${target ? fullHeight : 0}px`, opacity: target ? 1 : 0 },
        ],
        { duration: 220, easing, fill: "forwards" },
      );
      faqAnimations.set(details, { animation, target });
      animation.finished
        .then(() => {
          if (faqAnimations.get(details)?.animation !== animation) return;
          details.open = target;
          animation.cancel();
          faqAnimations.delete(details);
        })
        .catch(() => {});
    };
    root.addEventListener("click", faq);
    const stop = () => {
      if (!preference.matches) return;
      animations.forEach((animation) => animation.cancel());
      for (const [details, { animation, target }] of faqAnimations) {
        details.open = target;
        animation.cancel();
      }
      faqAnimations.clear();
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      changes.disconnect();
      root.removeEventListener("focusin", focus);
      root.removeEventListener("click", faq);
      preference.removeEventListener("change", stop);
      animations.forEach((animation) => animation.cancel());
      faqAnimations.forEach(({ animation }) => animation.cancel());
    };
  }, [pathname, density]);
  return null;
}
