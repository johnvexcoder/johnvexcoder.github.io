"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { assemblyState } from "@/lib/motion";

/** Visibility owns ambient work; continuous geometry is reserved for two story scenes. */
export default function SceneMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const scenes = [
      ...document.querySelectorAll<HTMLElement>("[data-motion-scene]"),
    ];
    const visible = new Set<HTMLElement>();
    const story = new Set(
      scenes.filter((el) => el.matches(".hero, .assembly-bridge")),
    );
    const written = new WeakMap<HTMLElement, Map<string, string>>();
    let frame = 0;
    let pointerTarget: HTMLElement | null = null;
    let pointerX = 0,
      pointerY = 0;
    const write = (el: HTMLElement, prop: string, value: string) => {
      let values = written.get(el);
      if (!values) {
        values = new Map();
        written.set(el, values);
      }
      if (values.get(prop) === value) return;
      values.set(prop, value);
      el.style.setProperty(prop, value);
    };
    const update = () => {
      frame = 0;
      if (reduced.matches || document.hidden) return;
      // All geometry reads precede any writes, including pointer resets.
      const measures = [...visible]
        .filter((el) => story.has(el))
        .map((el) => ({ el, rect: el.getBoundingClientRect() }));
      const pointerRect = pointerTarget?.getBoundingClientRect();
      for (const { el, rect } of measures) {
        if (el.matches(".assembly-bridge")) {
          const state = assemblyState(
            (innerHeight * 0.96 - rect.top) / (innerHeight * 0.64),
          );
          write(el, "--assembly-offset", state.offset.toFixed(3));
          write(el, "--assembly-progress", state.progress.toFixed(3));
          write(el, "--assembly-impact", state.impact.toFixed(3));
        } else
          write(
            el,
            "--hero-drift",
            fine.matches
              ? `${Math.min(innerHeight, Math.max(0, -rect.top)) * 0.08}px`
              : "0px",
          );
      }
      if (pointerTarget && pointerRect && fine.matches) {
        write(
          pointerTarget,
          "--pointer-x",
          Math.max(
            -1,
            Math.min(
              1,
              ((pointerX - pointerRect.left) / pointerRect.width) * 2 - 1,
            ),
          ).toFixed(3),
        );
        write(
          pointerTarget,
          "--pointer-y",
          Math.max(
            -1,
            Math.min(
              1,
              ((pointerY - pointerRect.top) / pointerRect.height) * 2 - 1,
            ),
          ).toFixed(3),
        );
      }
    };
    const schedule = () => {
      if (!frame && !reduced.matches && !document.hidden)
        frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visible.add(el);
            el.classList.toggle("scene-active", !document.hidden);
          } else {
            visible.delete(el);
            el.classList.remove("scene-active");
          }
        }
        schedule();
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );
    scenes.forEach((el) => {
      if (story.has(el)) el.classList.add("motion-ready");
      observer.observe(el);
    });
    const resetPointer = () => {
      if (pointerTarget) {
        write(pointerTarget, "--pointer-x", "0");
        write(pointerTarget, "--pointer-y", "0");
      }
      pointerTarget = null;
    };
    const pointer = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType !== "mouse")
        return;
      const el =
        (event.target as Element)?.closest<HTMLElement>(
          ".hero[data-motion-scene], .lost-experience[data-motion-scene]",
        ) ?? null;
      if (pointerTarget !== el) resetPointer();
      pointerTarget = el;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (el) schedule();
    };
    const preference = () => {
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        resetPointer();
        for (const el of story) {
          write(el, "--assembly-offset", "0");
          write(el, "--assembly-progress", "1");
          write(el, "--assembly-impact", "0");
          write(el, "--hero-drift", "0px");
        }
      } else schedule();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        scenes.forEach((el) => el.classList.remove("scene-active"));
      } else {
        visible.forEach((el) => el.classList.add("scene-active"));
        schedule();
      }
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    fine.addEventListener("change", resetPointer);
    preference();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      fine.removeEventListener("change", resetPointer);
      scenes.forEach((el) => {
        el.classList.remove("motion-ready", "scene-active");
        for (const prop of [
          "--assembly-offset",
          "--assembly-progress",
          "--assembly-impact",
          "--hero-drift",
          "--pointer-x",
          "--pointer-y",
        ])
          el.style.removeProperty(prop);
      });
    };
  }, [pathname]);
  return null;
}
