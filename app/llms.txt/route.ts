import { projects } from "@/lib/content";
import { servicePages } from "@/lib/services";
import { absoluteUrl, isIndexable } from "@/lib/seo";
export const dynamic = "force-static";
export function GET() {
  const text =
    [
      "# J0hnvexcoder — John Angelo De Joya",
      "",
      "> Independent freelance web developer in Bulacan, Philippines. From interface to infrastructure.",
      "",
      "A concise public link directory. Project demonstrations have scope limits documented on their case-study pages.",
      ...(isIndexable
        ? [
            "",
            "## Services",
            `- [Services overview](${absoluteUrl("/services/")})`,
            ...servicePages.map(
              (page) =>
                `- [${page.name}](${absoluteUrl(page.route)}): ${page.summary}`,
            ),
            "",
            "## Project case studies",
            ...projects.map(
              (project) =>
                `- [${project.name}](${absoluteUrl(`/work/${project.id}/`)}): ${project.shortDescription}`,
            ),
            "",
            "## About and contact",
            `- [Portfolio homepage](${absoluteUrl("/")})`,
            `- [Professional background](${absoluteUrl("/#about")})`,
            `- [Discuss a project](${absoluteUrl("/#contact")})`,
          ]
        : ["", "This preview is not intended for indexing."]),
    ].join("\n") + "\n";
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
