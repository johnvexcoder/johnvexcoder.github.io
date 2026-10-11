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
  "John Angelo De Joya (J0hnvexcoder), a freelance web developer in Bulacan, Philippines. Explore web development projects, full-stack apps and Linux systems.";

export const projectTopics: Record<string, string> = {
  "homelab-os": "Self-hosted infrastructure dashboard",
  "homelab-agent": "Linux telemetry service",
  compressme: "Python image compression tool",
  "jenica-portfolio": "Next.js portfolio website",
  movieflix: "Self-hosted media platform",
  "donut-house": "Next.js storefront demo",
  "jaron-portfolio": "Engineering portfolio website",
  "your-coffee": "Café ordering website demo",
  "python-keybr": "Python terminal typing trainer",
  distrozsh: "Linux ZSH configuration",
  "starbucks-portal": "Login interface demo",
  "smart-expense": "Expense tracking dashboard",
  monthsary: "Personal dedication website",
  "johnvex-winops": "PowerShell administration tools",
  jnglo: "Streetwear storefront demo",
  arkosenyo: "Architecture website demo",
  taitechmarine: "Marine equipment website demo",
  shoesonthego: "Interactive 3D footwear showcase",
  archeon: "Interactive 3D architecture demo",
};

export function projectSearchTitle(project: { id: string; name: string }) {
  return `${project.name} — ${projectTopics[project.id] || "Project case study"}`;
}

// Keep suitable source descriptions; clarify only vague or promotional summaries.
const projectDescriptions: Record<string, string> = {
  compressme:
    "CompressMe is a cross-platform Python image compression tool with a PySide6 desktop interface and command-line controls. Explore the project case study.",
  "smart-expense":
    "Smart Expense Visualizer is a browser expense-tracking demo with Chart.js charts, category filters and localStorage persistence. Explore the case study.",
  jnglo:
    "J&GLO is a fictional streetwear storefront demo built with Next.js. Explore the interactive store concept and project case study by J0hnvexcoder.",
  arkosenyo:
    "ARKOSENYO is a Next.js architecture website demo presenting architecture, interiors and construction. Explore the project case study by J0hnvexcoder.",
  taitechmarine:
    "TAITECH Marine is a Next.js website redesign demo for marine and industrial equipment, technical services and a demo request preview. Explore the case study.",
  shoesonthego:
    "Shoes on the Go is a personal, noncommercial 3D footwear concept using Three.js, React Three Fiber and GSAP. Explore the interactive showcase case study.",
};

export function projectSearchDescription(project: {
  id: string;
  shortDescription: string;
}) {
  return projectDescriptions[project.id] || project.shortDescription;
}
