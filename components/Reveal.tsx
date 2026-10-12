"use client";
import type { ReactNode } from "react";
/** The page coordinator owns one-shot reveals; server-rendered content is always visible. */
export default function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      data-reveal="group"
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
