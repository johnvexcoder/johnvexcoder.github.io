"use client";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { panPhase, panPosition } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useMedia";
import { ArrowDown, ArrowUp, Terminal, Layers } from "lucide-react";
import media from "@/content/media.json";
export default function Preview({
  project,
  large = false,
  priority = false,
}: {
  project: Project;
  large?: boolean;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    img = useRef<HTMLImageElement>(null);
  const control = useRef<(hold?: string, release?: string) => void>(() => {});
  const [overflow, setOverflow] = useState(false),
    [explore, setExplore] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current,
      image = img.current;
    if (!el || !image) return;
    let frame = 0,
      timer: ReturnType<typeof setTimeout> | undefined;
    let inView = false,
      phase = 0,
      previous = 0,
      maximum = 0,
      until = 0;
    const holds = new Set<string>();
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    const eligible = () =>
      inView &&
      !document.hidden &&
      !reduced &&
      !!project.scrollImage &&
      maximum > 20 &&
      !holds.size;
    const tick = (time: number) => {
      frame = 0;
      if (!eligible() || time < until) {
        previous = 0;
        return;
      }
      phase += previous ? Math.min(time - previous, 60) : 0;
      previous = time;
      el.scrollTop = panPosition(maximum, phase);
      frame = requestAnimationFrame(tick);
    };
    const schedule = () => {
      clearTimeout(timer);
      if (!eligible()) {
        stop();
        return;
      }
      const wait = until - performance.now();
      if (wait > 0) {
        stop();
        timer = setTimeout(schedule, wait + 10);
      } else if (!frame) frame = requestAnimationFrame(tick);
    };
    control.current = (hold, release) => {
      if (hold) holds.add(hold);
      if (release) holds.delete(release);
      stop();
      phase = panPhase(maximum, el.scrollTop);
      until = performance.now() + 6000;
      schedule();
    };
    const measure = () => {
      const old = maximum;
      maximum = project.scrollImage
        ? Math.max(0, el.scrollHeight - el.clientHeight)
        : 0;
      setOverflow(maximum > 20);
      if (old !== maximum) phase = panPhase(maximum, el.scrollTop);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    resize.observe(image);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        schedule();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    const visibility = () => schedule();
    document.addEventListener("visibilitychange", visibility);
    image.addEventListener("load", measure);
    measure();
    return () => {
      stop();
      clearTimeout(timer);
      resize.disconnect();
      observer.disconnect();
      image.removeEventListener("load", measure);
      document.removeEventListener("visibilitychange", visibility);
      control.current = () => {};
    };
  }, [project.id, project.scrollImage, reduced]);
  if (!project.image)
    return (
      <div className="project-symbol">
        <div>
          {project.category === "CLI" ? (
            <Terminal size={42} />
          ) : (
            <Layers size={42} />
          )}
        </div>
        <strong>{project.name}</strong>
        <span>
          {project.category === "CLI"
            ? "Terminal-native software"
            : project.imageWithheld
              ? "Self-hosted infrastructure dashboard"
              : "Dedicated telemetry service"}
        </span>
        <small>
          {project.imageWithheld
            ? "Interface illustration · private telemetry screenshot withheld"
            : "Interface illustration · no screenshot provided"}
        </small>
      </div>
    );
  const size = (media as Record<string, { width: number; height: number }>)[
    project.scrollImage || project.image
  ];
  return (
    <div
      className={`preview ${large ? "large" : ""} ${explore ? "exploring" : ""}`}
    >
      <div className="browser-bar">
        <span>
          <i />
          <i />
          <i />
        </span>
        <small>{project.name} / interface preview</small>
        <span className="browser-label">SCREENSHOT</span>
      </div>
      <div
        ref={ref}
        className={`preview-window ${project.scrollImage ? "full-page" : "normal-screenshot"}`}
        tabIndex={overflow ? 0 : undefined}
        role="region"
        aria-label={`${project.name} screenshot preview${overflow ? ", scroll to explore" : ""}`}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") control.current("hover");
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") control.current(undefined, "hover");
        }}
        onFocus={() => control.current("focus")}
        onBlur={() => control.current(undefined, "focus")}
        onWheel={() => control.current()}
        onKeyDown={() => control.current()}
        onTouchStart={() => control.current("touch")}
        onTouchEnd={() => control.current(undefined, "touch")}
        onTouchCancel={() => control.current(undefined, "touch")}
      >
        <img
          ref={img}
          src={project.scrollImage || project.image}
          alt={
            project.imageAlt || `${project.name} — ${project.shortDescription}`
          }
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          width={size?.width || 1366}
          height={size?.height || 900}
          onError={(e) => {
            const image = e.currentTarget;
            if (image.dataset.fallback) return;
            image.dataset.fallback = "true";
            image.src = project.imageFallback || project.image || "";
          }}
        />
      </div>
      {overflow && (
        <div className="preview-tools">
          <span>
            {reduced
              ? "Scroll to explore"
              : explore
                ? "Manual exploration"
                : "Automatic page preview"}
          </span>
          {!reduced && (
            <button
              onClick={() => {
                const next = !explore;
                setExplore(next);
                control.current(
                  next ? "explicit" : undefined,
                  next ? undefined : "explicit",
                );
              }}
              aria-pressed={explore}
            >
              {explore ? "Return to automatic" : "Explore screenshot"}
              <ArrowDown size={12} />
            </button>
          )}
          {explore && (
            <button
              onClick={() =>
                ref.current?.scrollTo({
                  top: 0,
                  behavior: reduced ? "auto" : "smooth",
                })
              }
              aria-label="Return screenshot to top"
            >
              <ArrowUp size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
