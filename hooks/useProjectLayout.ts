"use client";
import { useLayoutEffect, useRef } from "react";

/** Preserve spatial continuity for surviving rows; new rows use page entrances. */
export function useProjectLayout() {
  const list = useRef<HTMLDivElement>(null);
  const before = useRef(new Map<string, DOMRect>());
  const animations = useRef(new Set<Animation>());
  const capture = (animate = true) => {
    animations.current.forEach((animation) => animation.cancel());
    animations.current.clear();
    before.current.clear();
    if (
      typeof Element.prototype.animate !== "function" ||
      !animate ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    list.current
      ?.querySelectorAll<HTMLElement>("[data-ga-project]")
      .forEach((row) => {
        const rect = row.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top <= innerHeight)
          before.current.set(row.dataset.gaProject!, rect);
      });
  };
  useLayoutEffect(() => {
    const listElement = list.current;
    if (!listElement || before.current.size === 0) return;
    // Read every destination before creating compositor animations.
    const moves = Array.from(
      listElement.querySelectorAll<HTMLElement>("[data-ga-project]"),
    ).map((row) => ({
      row,
      from: before.current.get(row.dataset.gaProject!),
      to: row.getBoundingClientRect(),
    }));
    before.current.clear();
    for (const { row, from, to } of moves) {
      if (
        !from ||
        row.getAnimations().length ||
        to.bottom < 0 ||
        to.top > innerHeight
      )
        continue;
      const y = from.top - to.top;
      if (Math.abs(y) < 1 || Math.abs(y) > innerHeight * 0.7) continue;
      const animation = row.animate(
        [{ transform: `translateY(${y}px)` }, { transform: "translateY(0)" }],
        {
          duration: 220,
          easing: "cubic-bezier(.23,1,.32,1)",
        },
      );
      animations.current.add(animation);
      animation.finished
        .then(() => animations.current.delete(animation))
        .catch(() => animations.current.delete(animation));
    }
  });
  useLayoutEffect(() => {
    const active = animations.current;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (preference.matches) active.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", stop);
    return () => {
      active.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, []);
  return { list, capture };
}
