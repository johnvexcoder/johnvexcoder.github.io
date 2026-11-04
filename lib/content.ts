import sourceProjects from "@/content/projects.json";
import sourceProfile from "@/content/profile.json";
import sourceReviews from "@/content/testimonials.json";
import sourceConcepts from "@/content/concepts.json";
export type Project = {
  id: string;
  classification: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string | null;
  imageAlt?: string;
  previewLabel?: string;
  imageWithheld?: boolean;
  scrollImage?: string;
  imageFallback?: string;
  logo?: string | null;
  logoFallback?: string;
  technologies: string[];
  status: string;
  github: string | null;
  docs: string | null;
  release: string | null;
  demo: string | null;
  openSource: boolean;
  featured: boolean;
  facts: string[];
  problemSolution: string;
  disclaimer?: string;
  sourceCapture?: boolean;
  serviceIds: string[];
  industry?: string;
};
export const projects = sourceProjects as Project[];
export const projectsForService = (serviceId: string) =>
  projects.filter((project) => project.serviceIds.includes(serviceId));
export const categories = ["All", ...new Set(projects.map((p) => p.category))];
export const profile = sourceProfile;
export const reviews = sourceReviews;
export const concepts = sourceConcepts;
export const tagline = "I don't just fix what's broken. I build what lasts.";
export { navigation } from "./navigation";
export const contacts = [
  ["Email", "mailto:johnangelodejoya@gmail.com", "johnangelodejoya@gmail.com"],
  [
    "LinkedIn",
    "https://www.linkedin.com/in/johnvexcoder/",
    "linkedin.com/in/johnvexcoder",
  ],
  ["GitHub", "https://github.com/johnvexcoder", "github.com/johnvexcoder"],
  ["WhatsApp", "https://wa.me/639331045271", "+63 933 104 5271"],
  ["Telegram", "https://t.me/j0hnvexcoder", "@j0hnvexcoder"],
  ["X / Twitter", "https://x.com/johnvexcoder", "@johnvexcoder"],
];
export const services = [
  [
    "Web Development",
    "Responsive websites, landing pages, portfolios, business sites, and WordPress work built for usability and maintainability.",
    "Discuss a website",
    "Website project",
  ],
  [
    "Maintenance & Automation",
    "Website updates, troubleshooting, performance improvements, and Python tools that reduce repetitive work.",
    "Improve a workflow",
    "Maintenance or automation",
  ],
  [
    "Infrastructure & Deployment",
    "Linux server setup, Docker deployment, homelab guidance, monitoring, and self-hosted service configuration.",
    "Plan a deployment",
    "Infrastructure and deployment",
  ],
  [
    "Technical Support",
    "Troubleshooting for computers, websites, Linux environments, and basic networking, plus custom technical requests.",
    "Ask for support",
    "Technical support",
  ],
];
export const skills = {
  "Frontend Development": [
    "HTML5",
    "CSS3",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Vite",
    "WordPress",
    "GSAP",
    "Three.js",
  ],
  "Backend & APIs": [
    "Node.js",
    "Express.js",
    "Python",
    "PHP",
    "Java",
    "REST API",
    "WebSockets",
    "Authentication",
  ],
  "UI/UX & Design": [
    "UI/UX Design",
    "Responsive Design",
    "Design Systems",
    "Motion (Framer Motion)",
  ],
  "Databases & Data": [
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "Redis",
    "IndexedDB",
    "Zustand",
    "Zod",
    "localStorage",
  ],
  "Servers & Infrastructure": [
    "Linux",
    "Docker",
    "Proxmox",
    "Nginx",
    "Debian",
    "Ubuntu",
    "Tailscale",
    "Bash",
    "Networking",
  ],
  "Hosting & Cloud": [
    "Cloudflare",
    "Vercel",
    "Netlify",
    "Hostinger",
    "GitHub Pages",
  ],
  "Business Systems": [
    "Admin Dashboards",
    "CRM",
    "CMS",
    "Internal Tools",
    "Business Applications",
  ],
  "Development & AI Tools": [
    "Git",
    "GitHub",
    "VS Code",
    "ChatGPT",
    "Codex",
    "Claude",
    "OpenCode",
    "Playwright",
  ],
};
export function actions(p: Project) {
  return [
    [
      p.demo?.startsWith("/")
        ? "Local demo"
        : p.id === "movieflix"
          ? "Self-hosted demo"
          : "Live site",
      p.id === "movieflix" ? null : p.demo,
    ],
    ["Repository", p.github],
    ["Documentation", p.docs],
    ["Releases", p.release],
  ].filter((a): a is [string, string] => !!a[1]);
}
export const isDemoAction = (name: string) => /demo|live site/i.test(name);
export const statusLabel = (s: string) =>
  ({
    active: "Active",
    completed: "Completed",
    experimental: "Experimental",
    demo: "Demo concept",
    concept: "Concept",
    comingSoon: "Coming soon",
    capture: "Source capture",
  })[s] || s;
