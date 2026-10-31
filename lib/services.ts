import type { Metadata } from "next";
import content from "@/content/services.json";
import { absoluteUrl } from "./seo";
import { projectsForService } from "./content";
export const serviceContent = content;
export const servicePages = content.pages.map((page) => ({
  ...page,
  examples: projectsForService(page.id).map((project) => project.id),
}));
export function serviceMetadata(page: {
  title: string;
  description: string;
  route: string;
}): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: {
      canonical: page.route,
      types: {
        "text/markdown":
          page.route === "/services/"
            ? "/markdown/services.md"
            : `/markdown/services-${page.route.split("/").filter(Boolean).at(-1)}.md`,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: absoluteUrl(page.route),
      siteName: "J0hnvexcoder",
      locale: "en_PH",
      type: "website",
      images: [
        {
          url: "/social.png",
          width: 1200,
          height: 630,
          alt: "John Angelo De Joya — J0hnvexcoder",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/social.png"],
    },
  };
}
