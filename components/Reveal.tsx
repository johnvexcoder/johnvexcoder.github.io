"use client";
import { useEffect, useRef, type ReactNode } from "react";
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-in");
        } else {
          el.classList.remove("reveal-in");
          el.classList.toggle(
            "reveal-out-top",
            entry.boundingClientRect.top < 0,
          );
        }
      },
      { threshold: 0.05 },
    );
    el.classList.add("reveal-ready");
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.classList.remove("reveal-ready", "reveal-in", "reveal-out-top");
    };
  }, []);
  return (
    <div
      ref={ref}
      data-motion-scene={
        className.includes("project-plate")
          ? "project"
          : className.includes("section-heading")
            ? "heading"
            : "detail"
      }
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
