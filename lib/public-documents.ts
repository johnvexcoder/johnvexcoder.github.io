import pages from "../content/site-pages.json" with { type: "json" };
import projects from "../content/projects.json" with { type: "json" };
import studies from "../content/case-studies.json" with { type: "json" };
import services from "../content/services.json" with { type: "json" };
import profile from "../content/profile.json" with { type: "json" };
import { confirmedSiteOrigin } from "./seo-policy.ts";
const absolute = (path: string) => new URL(path, confirmedSiteOrigin).href;
const link = (name: string, path: string) =>
  `[${name.replaceAll("[", "").replaceAll("]", "")}](${absolute(path)})`;
export function publicDocuments() {
  const documents = pages.map((page) => ({
    id: page.id,
    route: page.route,
    title: page.title,
    description: page.description,
    body: [
      `# ${page.heading}`,
      "",
      ...page.paragraphs.flatMap((p) => [p, ""]),
      ...(page.id === "about"
        ? [
            "## Development practice",
            "",
            ...profile.capabilities.flatMap((c) => [
              `### ${c.label}`,
              c.copy,
              c.tech.join(", "),
              "",
            ]),
            "## Experience",
            "",
            ...profile.experience.flatMap((e) => [
              `### ${e.title}`,
              `${e.date} — ${e.place}`,
              e.copy,
              "",
            ]),
          ]
        : []),
      ...(page.id === "work" || page.id === "home"
        ? [
            "## Public work",
            "",
            ...projects.map(
              (p) =>
                `- ${link(p.name, `/work/${p.id}/`)} — ${p.classification}. ${p.shortDescription}`,
            ),
            "",
          ]
        : []),
      ...(page.id === "contact"
        ? [
            "## Project inquiries",
            "",
            `Email: ${profile.email}`,
            "The contact page accepts project type, optional company/website, budget/currency, desired timeline and project description. Web3Forms processes inquiries with hCaptcha spam verification.",
            "",
          ]
        : []),
    ].join("\n"),
  }));
  documents.push({
    id: "services",
    route: "/services/",
    title: services.main.title,
    description: services.main.description,
    body: [
      `# ${services.main.h1}`,
      "",
      services.main.intro,
      "",
      ...services.pages.map((s) => `- ${link(s.name, s.route)} — ${s.summary}`),
      "",
      "## Questions about working together",
      ...services.main.faq.flatMap(([question, answer]) => [
        `### ${question}`,
        answer,
        "",
      ]),
    ].join("\n"),
  });
  for (const s of services.pages)
    documents.push({
      id: `services-${s.id}`,
      route: s.route,
      title: s.title,
      description: s.description,
      body: [
        `# ${s.name}`,
        "",
        s.summary,
        "",
        "## The problem",
        s.problem,
        "",
        "## The approach",
        s.solution,
        "",
        "## Scope and delivery",
        s.distinctSection,
        "",
        ...s.scope.map((item) => `- ${item}`),
        "",
        `## ${s.engineering.heading}`,
        s.engineering.intro,
        ...s.engineering.steps.flatMap(([title, copy]) => [
          `### ${title}`,
          copy,
          "",
        ]),
        "### What helps us start",
        s.engineering.inputs,
        "### Boundaries to agree",
        s.engineering.considerations,
        "### What you receive",
        ...s.engineering.deliverables.map((item) => `- ${item}`),
        ...(s.portfolioCase
          ? [
              "",
              `## ${s.portfolioCase.heading}`,
              s.portfolioCase.problem,
              s.portfolioCase.baseline,
              ...s.portfolioCase.actions.map((item) => `- ${item}`),
              ...s.portfolioCase.results.map(
                ([value, label]) => `- ${value} ${label}`,
              ),
              s.portfolioCase.limits,
            ]
          : []),
        "",
        "## Questions about this service",
        ...s.faq.flatMap(([question, answer]) => [
          `### ${question}`,
          answer,
          "",
        ]),
        "## Related project evidence",
        s.evidence,
        "",
        ...projects
          .filter((p) => p.serviceIds.includes(s.id))
          .map(
            (p) =>
              `- ${link(p.name, `/work/${p.id}/`)} — ${p.shortDescription}`,
          ),
        "",
        ...s.contextLinks.map((related) => link(related.label, related.route)),
        "",
        link("Discuss a project", "/contact/"),
      ].join("\n"),
    });
  for (const project of projects) {
    const study = studies.find((s) => s.id === project.id);
    documents.push({
      id: `work-${project.id}`,
      route: `/work/${project.id}/`,
      title: project.name,
      description: study?.meta || project.shortDescription,
      body: [
        `# ${project.name}`,
        "",
        `Classification: ${project.classification}`,
        ...(study?.subtitle ? [study.subtitle] : []),
        ...(study
          ? [`Project type: ${study.type}`, `Status: ${study.status}`]
          : []),
        project.shortDescription,
        "",
        ...(study
          ? [
              "## Overview",
              study.overview,
              "",
              "## Problem",
              study.problem,
              "",
              "## Engineering approach",
              study.approach,
              "",
              "## Features",
              ...study.features.map((f) => `- ${f}`),
              "",
              "## Verified result",
              study.result,
              "",
              "## Scope and limitations",
              study.tradeoff,
            ]
          : [project.description, project.problemSolution]),
        "",
        "## Technologies",
        project.technologies.join(", "),
        "",
        project.disclaimer || "",
        "## Related services",
        ...services.pages
          .filter((s) => project.serviceIds.includes(s.id))
          .map((s) => `- ${link(s.name, s.route)}`),
      ].join("\n"),
    });
  }
  return documents.map((d) => ({
    ...d,
    markdownPath: `/markdown/${d.id}.md`,
    markdown: [
      d.body,
      "",
      "---",
      `Canonical HTML: ${absolute(d.route)}`,
      `Summary: ${d.description}`,
      "Read the canonical HTML page for interactive previews and inquiry submission.",
      "",
    ].join("\n"),
  }));
}
export function llmsDirectory() {
  const docs = publicDocuments();
  return [
    "# J0hnvexcoder — John Angelo De Joya",
    "",
    "> Philippines-based freelance web developer. From interface to infrastructure. Available for remote collaboration; based in Bulacan, Philippines.",
    "",
    "Public project classifications and case-study scope distinguish client work, independent software and demonstrations. No ranking, uptime or AI-citation outcome is implied.",
    "",
    "## Main pages",
    ...docs
      .filter((d) => !d.id.startsWith("work-") && !d.id.startsWith("services-"))
      .map(
        (d) =>
          `- ${link(d.title, d.route)}: ${d.description} ([Markdown](${absolute(d.markdownPath)}))`,
      ),
    "",
    "## Services",
    ...docs
      .filter((d) => d.id.startsWith("services-"))
      .map(
        (d) =>
          `- ${link(d.title, d.route)} ([Markdown](${absolute(d.markdownPath)}))`,
      ),
    "",
    "## Project case studies",
    ...docs
      .filter((d) => d.id.startsWith("work-"))
      .map(
        (d) =>
          `- ${link(d.title, d.route)}: ${d.description} ([Markdown](${absolute(d.markdownPath)}))`,
      ),
    "",
  ].join("\n");
}
