/* eslint-disable @next/next/no-img-element -- Static export uses checked-in responsive variants. */
import media from "@/content/media.json";

type ImageSource = { src: string; width: number };
const assets = media as Record<string, { sources?: ImageSource[] }>;

/** Decorative project marks retain their 22px slot at every display density. */
export default function ProjectLogo({ src }: { src: string }) {
  const sources = assets[src]?.sources;
  return (
    <img
      className="project-logo"
      src={sources?.[0]?.src || src}
      srcSet={sources
        ?.map((source) => `${source.src} ${source.width}w`)
        .join(", ")}
      sizes={sources ? "22px" : undefined}
      width={22}
      height={22}
      alt=""
      loading="lazy"
    />
  );
}
