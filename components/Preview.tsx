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
  const holdsRef = useRef(new Set<string>());
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current,
      image = img.current;
    if (!el || !image || typeof image.animate !== "function") return;
    let animation: Animation | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let inView = false,
      maximum = 0,
      resumeAt = 0;
    const holds = holdsRef.current;
    const position = () =>
      animation
        ? panPosition(maximum, Number(animation.currentTime || 0))
        : el.scrollTop;
    // Transfer the rendered transform to native scroll before manual input.
    const stop = () => {
      // An idle preview already uses native scroll. Avoid rewriting its style and
      // scroll position during every offscreen/initial ResizeObserver callback.
      if (!animation) return;
      const current = position();
      animation?.cancel();
      animation = undefined;
      image.style.willChange = "";
      el.scrollTop = current;
    };
    const schedule = () => {
      clearTimeout(timer);
      if (
        !inView ||
        document.hidden ||
        reduced ||
        !project.scrollImage ||
        maximum <= 20 ||
        holds.size
      ) {
        stop();
        return;
      }
      if (animation) return;
      const wait = resumeAt - performance.now();
      if (wait > 0) {
        timer = setTimeout(schedule, wait);
        return;
      }
      const current = el.scrollTop;
      const travel = Math.max(12000, (maximum / 42) * 1000);
      const duration = travel * 2 + 3200;
      el.scrollTop = 0;
      image.style.willChange = "transform";
      animation = image.animate(
        [
          { transform: "translateY(0)", offset: 0 },
          { transform: "translateY(0)", offset: 1600 / duration },
          {
            transform: `translateY(${-maximum}px)`,
            offset: (1600 + travel) / duration,
          },
          {
            transform: `translateY(${-maximum}px)`,
            offset: (3200 + travel) / duration,
          },
          { transform: "translateY(0)", offset: 1 },
        ],
        { duration, iterations: Infinity, easing: "linear" },
      );
      animation.currentTime = current > 0 ? panPhase(maximum, current) : 0;
    };
    control.current = (hold, release) => {
      stop();
      if (hold === "return") {
        el.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      } else {
        // Interrupt an in-progress native return before the next inspection.
        el.scrollTo({ top: el.scrollTop, behavior: "instant" });
        if (hold) holds.add(hold);
        if (release) holds.delete(release);
      }
      resumeAt = performance.now() + 1200;
      schedule();
    };
    const measure = () => {
      const next = project.scrollImage
        ? Math.max(0, image.offsetHeight - el.clientHeight)
        : 0;
      if (maximum !== next) {
        stop();
        maximum = next;
      }
      setOverflow(maximum > 20);
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    resize.observe(image);
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        schedule();
      },
      { threshold: [0, 0.25] },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", schedule);
    image.addEventListener("load", measure);
    measure();
    return () => {
      stop();
      clearTimeout(timer);
      resize.disconnect();
      observer.disconnect();
      image.removeEventListener("load", measure);
      document.removeEventListener("visibilitychange", schedule);
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
  const size = (
    media as Record<
      string,
      {
        width: number;
        height: number;
        sources?: { src: string; width: number }[];
      }
    >
  )[project.scrollImage || project.image];
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
          if (e.pointerType === "mouse") control.current(undefined, "hover");
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse")
            if (!explore) control.current("return");
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
          srcSet={size?.sources
            ?.map((source) => `${source.src} ${source.width}w`)
            .join(", ")}
          sizes={
            large
              ? "(max-width: 760px) calc(100vw - 44px), (max-width: 1100px) 90vw, 60vw"
              : "(max-width: 760px) calc(100vw - 44px), 45vw"
          }
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
      {project.scrollImage && (
        <div className="preview-tools">
          <span>
            {reduced
              ? "Scroll to explore"
              : explore
                ? "Manual exploration"
                : "Automatic page preview"}
          </span>
          {overflow && (
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
              {explore
                ? reduced
                  ? "Finish exploring"
                  : "Return to automatic"
                : "Explore screenshot"}
              <ArrowDown size={12} />
            </button>
          )}
          {large && (
            <a
              href={project.scrollImage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open full ${project.name} screenshot`}
            >
              Full screenshot <ArrowUp size={12} />
            </a>
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
