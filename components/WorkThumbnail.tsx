/* eslint-disable @next/next/no-img-element -- Responsive static assets, no image server. */
import { Terminal, Layers } from "lucide-react";
import type { Project } from "@/lib/content";
import thumbnails from "@/content/work-thumbnails.json";
/** Still directory previews keep browsing calm; interactive inspection lives in the case study. */
export default function WorkThumbnail({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const asset = (
    thumbnails as Record<
      string,
      {
        width: number;
        height: number;
        sources: { src: string; width: number }[];
      }
    >
  )[project.id];
  return (
    <div
      className={`work-thumbnail ${project.image ? "" : "work-thumbnail-technical"}`}
    >
      {project.image ? (
        <img
          src={asset?.sources.at(-1)?.src || project.image}
          srcSet={asset?.sources?.map((s) => `${s.src} ${s.width}w`).join(", ")}
          sizes="(max-width:600px) calc(100vw - 40px), (max-width:1100px) 45vw, 30vw"
          width={asset?.width || 1366}
          height={asset?.height || 900}
          alt={
            project.imageAlt || `${project.name} — ${project.shortDescription}`
          }
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      ) : (
        <>
          <span className="technical-artifact" aria-hidden="true">
            {project.category === "CLI" ? (
              <Terminal size={32} />
            ) : (
              <Layers size={32} />
            )}
          </span>
          <strong>{project.name}</strong>
          <span>
            {project.category === "CLI"
              ? "Terminal-native software"
              : "Linux & self-hosted systems"}
          </span>
          <small>
            {project.imageWithheld
              ? "Private telemetry screenshot withheld"
              : "No screenshot provided"}
          </small>
        </>
      )}
    </div>
  );
}
