import studies from "../content/case-studies.json" with { type: "json" };
export const confirmedSiteOrigin = "https://johnvexcoder.github.io";

export function resolveSiteOrigin(value = confirmedSiteOrigin) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1"
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be the confirmed HTTPS root origin, without a path, port, query or credentials.",
    );
  }
  return url.origin;
}

export function resolveIndexing(value = "production") {
  if (value !== "production" && value !== "preview") {
    throw new Error("SITE_INDEXING must be production or preview.");
  }
  return value === "production";
}

export const homeSearchTitle =
  "J0hnvexcoder | Freelance Web Developer in Bulacan";
export const homeSearchDescription =
  "John Angelo De Joya (J0hnvexcoder), independent freelance web developer in Bulacan, Philippines. Business websites, portfolios, custom apps and technical SEO.";

export const projectTopics: Record<string, string> = {
  "homelab-os": "Self-hosted infrastructure dashboard",
  "homelab-agent": "Linux telemetry agent",
  compressme: "Python image compression tool",
  "jenica-portfolio": "Client Next.js portfolio website",
  movieflix: "Self-hosted media streaming platform",
  "donut-house": "Interactive bakery storefront demo",
  "jaron-portfolio": "Client engineering portfolio website",
  "your-coffee": "Café ordering website demo",
  "python-keybr": "Python terminal typing trainer",
  distrozsh: "Linux ZSH configuration",
  "starbucks-portal": "Responsive login interface demo",
  "smart-expense": "Expense tracking dashboard",
  monthsary: "Interactive personal anniversary website",
  "johnvex-winops": "PowerShell administration toolkit",
  jnglo: "Next.js fashion storefront demo",
  arkosenyo: "Client architecture website development",
  taitechmarine: "Client marine equipment website",
  shoesonthego: "Interactive 3D product showcase",
  archeon: "Interactive 3D architecture visualization",
};

export function projectSearchTitle(project: { id: string; name: string }) {
  return `${project.name} — ${projectTopics[project.id] || "Project case study"}`;
}

export function projectSearchDescription(project: {
  id: string;
  shortDescription: string;
}) {
  return (
    studies.find((study) => study.id === project.id)?.meta ||
    project.shortDescription
  );
}
