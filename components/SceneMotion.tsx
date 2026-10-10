"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { assemblyState } from "@/lib/motion";

/** One event-driven coordinator: only visible scenes receive compositor values. */
export default function SceneMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const scenes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-motion-scene]"),
    );
    const visible = new Set<HTMLElement>();
    let frame = 0,
      pointerFrame = 0;
    let pointerTarget: HTMLElement | null = null,
      pointerX = 0,
      pointerY = 0;
    const update = () => {
      frame = 0;
      if (reduced.matches || document.hidden) return;
      for (const el of visible) {
        const rect = el.getBoundingClientRect();
        const progress = (innerHeight * 0.96 - rect.top) / (innerHeight * 0.64);
        const state = assemblyState(progress);
        el.style.setProperty("--assembly-offset", String(state.offset));
        el.style.setProperty("--assembly-progress", String(state.progress));
        el.style.setProperty("--assembly-impact", String(state.impact));
        const departure = Math.max(
          0,
          Math.min(
            1,
            (0.18 * innerHeight - rect.bottom) / (0.25 * innerHeight),
          ),
        );
        el.style.setProperty("--departure", String(departure));
        if (el.dataset.motionScene === "hero") {
          el.style.setProperty(
            "--hero-drift",
            `${Math.max(0, -rect.top) * 0.1}px`,
          );
        }
      }
    };
    const schedule = () => {
      if (!frame && !reduced.matches) frame = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            visible.add(el);
            el.classList.add("scene-active");
          } else {
            visible.delete(el);
            el.classList.remove("scene-active");
          }
        }
        schedule();
      },
      { rootMargin: "180px 0px", threshold: 0 },
    );
    scenes.forEach((el) => {
      el.classList.add("motion-ready");
      observer.observe(el);
    });
    const resetPointer = () => {
      pointerTarget?.style.setProperty("--pointer-x", "0");
      pointerTarget?.style.setProperty("--pointer-y", "0");
      pointerTarget = null;
    };
    const pointer = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches || event.pointerType !== "mouse")
        return;
      const el = (event.target as Element)?.closest<HTMLElement>(
        "[data-motion-scene]",
      );
      if (!el) {
        resetPointer();
        return;
      }
      if (pointerTarget !== el) {
        resetPointer();
        pointerTarget = el;
      }
      const box = el.getBoundingClientRect();
      pointerX = Math.max(
        -1,
        Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1),
      );
      pointerY = Math.max(
        -1,
        Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1),
      );
      if (!pointerFrame)
        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;
          pointerTarget?.style.setProperty("--pointer-x", pointerX.toFixed(3));
          pointerTarget?.style.setProperty("--pointer-y", pointerY.toFixed(3));
        });
    };
    const preference = () => {
      if (reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        resetPointer();
        for (const el of scenes) {
          el.style.setProperty("--assembly-offset", "0");
          el.style.setProperty("--assembly-progress", "1");
          el.style.setProperty("--assembly-impact", "0");
          el.style.setProperty("--departure", "0");
          el.style.setProperty("--hero-drift", "0px");
        }
      } else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("pointermove", pointer, { passive: true });
    document.addEventListener("pointerleave", resetPointer);
    document.addEventListener("visibilitychange", schedule);
    reduced.addEventListener("change", preference);
    preference();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(pointerFrame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("pointermove", pointer);
      document.removeEventListener("pointerleave", resetPointer);
      document.removeEventListener("visibilitychange", schedule);
      reduced.removeEventListener("change", preference);
      for (const el of scenes) {
        el.classList.remove("motion-ready", "scene-active");
        for (const prop of [
          "--assembly-offset",
          "--assembly-progress",
          "--assembly-impact",
          "--departure",
          "--pointer-x",
          "--pointer-y",
          "--hero-drift",
        ])
          el.style.removeProperty(prop);
      }
    };
  }, [pathname]);
  return null;
}
