"use client";
import { useEffect, useRef } from "react";
import { timelineStops } from "@/lib/operational-motion";
type Battery = EventTarget & { charging: boolean; level: number };
export default function ExperienceTimelineMotion() {
  const wireRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wire = wireRef.current;
    const root = wire?.closest<HTMLElement>(".experience-network");
    if (!wire || !root || !root.animate || !("IntersectionObserver" in window)) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & { saveData?: boolean };
      }
    ).connection;
    let visible = false,
      disposed = false,
      timer: ReturnType<typeof setTimeout> | undefined,
      battery: Battery | undefined;
    const active = new Set<Animation>();
    const stop = () => {
      clearTimeout(timer);
      active.forEach((a) => a.cancel());
      active.clear();
      root.dataset.motionRunning = "false";
    };
    const restricted = () =>
      preference.matches ||
      !!connection?.saveData ||
      (!!battery && !battery.charging && battery.level <= 0.2);
    const allowed = () =>
      !disposed && visible && !document.hidden && !restricted();
    const play = (
      el: Element,
      frames: Keyframe[],
      duration: number,
      delay = 0,
      easing = "cubic-bezier(.22,1,.36,1)",
    ) => {
      const a = el.animate(frames, {
        duration,
        delay,
        easing,
        fill: "none",
      });
      active.add(a);
      a.finished.then(() => active.delete(a)).catch(() => active.delete(a));
      return a;
    };
    const cycle = () => {
      if (!allowed()) return;
      root.dataset.motionRunning = "true";
      root.dataset.motionCycle = String(
        Number(root.dataset.motionCycle || 0) + 1,
      );
      const rect = root.getBoundingClientRect();
      const markers = [
        ...root.querySelectorAll<HTMLElement>(".timeline-marker"),
      ];
      const bounds = markers.map((m) => m.getBoundingClientRect());
      const positions = markers.map((m) => {
        const r = m.getBoundingClientRect();
        return r.top - rect.top + r.height / 2;
      });
      const start = positions[0] || 0;
      if (bounds.length) {
        wire.style.transform = `translate(${bounds[0].left - rect.left + bounds[0].width / 2}px,${start}px)`;
        wire.style.height = `${Math.max(1, positions.at(-1)! - start)}px`;
      }
      const stops = timelineStops(positions.map((y) => y - start));
      const pulse = root.querySelector(".experience-pulse");
      if (pulse && stops.length)
        play(
          pulse,
          [
            { transform: `translateY(${stops[0].y - 24}px)`, opacity: 0.8 },
            { opacity: 1, offset: 0.08 },
            { opacity: 1, offset: 0.92 },
            {
              transform: `translateY(${stops.at(-1)!.y - 24}px)`,
              opacity: 0.35,
            },
          ],
          3600,
          0,
          "linear",
        );
      stops.forEach(({ delay }, i) => {
        const glow = markers[i].parentElement?.querySelector(
          ".timeline-title-glow",
        );
        if (glow) {
          const lead = Math.min(delay, 160);
          const duration = 900;
          play(
            glow,
            lead
              ? [{ opacity: 0 }, { opacity: 1, offset: lead / duration }, { opacity: 0 }]
              : [{ opacity: 1 }, { opacity: 0 }],
            duration,
            delay - lead,
            "linear",
          );
        }
      });
      timer = setTimeout(() => {
        stop();
        if (allowed()) timer = setTimeout(cycle, 4800);
      }, 4600);
    };
    const reconcile = () => {
      stop();
      if (disposed) return;
      if (allowed()) timer = setTimeout(cycle, 1200);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        reconcile();
      },
      { threshold: 0.12 },
    );
    observer.observe(root);
    const resize =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(reconcile)
        : undefined;
    resize?.observe(root);
    document.addEventListener("visibilitychange", reconcile);
    preference.addEventListener("change", reconcile);
    connection?.addEventListener("change", reconcile);
    const batteryNavigator = navigator as Navigator & {
      getBattery?: () => Promise<Battery>;
    };
    batteryNavigator
      .getBattery?.()
      .then((b) => {
        if (disposed) return;
        battery = b;
        b.addEventListener("levelchange", reconcile);
        b.addEventListener("chargingchange", reconcile);
        reconcile();
      })
      .catch(() => {});
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      resize?.disconnect();
      document.removeEventListener("visibilitychange", reconcile);
      preference.removeEventListener("change", reconcile);
      connection?.removeEventListener("change", reconcile);
      battery?.removeEventListener("levelchange", reconcile);
      battery?.removeEventListener("chargingchange", reconcile);
    };
  }, []);
  return (
    <div ref={wireRef} className="experience-wire" aria-hidden="true">
      <i className="experience-pulse" />
    </div>
  );
}
