import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { absoluteUrl, projectSocialImage, isIndexable } from "@/lib/seo";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable) return [];
  return [
    {
      url: absoluteUrl("/"),
      images: [
        absoluteUrl("/social.png"),
        absoluteUrl("/source/me/portrait.webp"),
      ],
    },
    ...projects.map((p) => ({
      url: absoluteUrl(`/work/${p.id}/`),
      ...(p.image
        ? { images: [absoluteUrl(p.image), absoluteUrl(projectSocialImage(p))] }
        : {}),
    })),
  ];
}
