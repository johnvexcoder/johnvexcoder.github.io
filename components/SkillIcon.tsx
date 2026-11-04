"use client";
import { useState } from "react";
import {
  AppWindow,
  Cable,
  Component,
  ContactRound,
  Database,
  Files,
  LayoutDashboard,
  Network,
  PanelsTopLeft,
  PenTool,
  ShieldCheck,
  Webhook,
  Wrench,
} from "lucide-react";
const logos: Record<string, string> = {
  HTML5: "html5",
  CSS3: "css3",
  JavaScript: "javascript",
  "Next.js": "nextjs",
  React: "react",
  TypeScript: "typescript",
  "Node.js": "nodejs",
  "Express.js": "express",
  Python: "python",
  PHP: "php",
  Java: "java",
  WordPress: "wordpress",
  "Tailwind CSS": "tailwindcss",
  Vite: "vite",
  GSAP: "gsap",
  "Three.js": "threejs",
  "Motion (Framer Motion)": "framermotion",
  Zustand: "zustand",
  Linux: "linux",
  Docker: "docker",
  Proxmox: "proxmox",
  Nginx: "nginx",
  Debian: "debian",
  Ubuntu: "ubuntu",
  Tailscale: "tailscale",
  Bash: "bash",
  SQLite: "sqlite",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  Redis: "redis",
  Zod: "zod",
  Git: "git",
  GitHub: "github",
  Vercel: "vercel",
  Cloudflare: "cloudflare",
  Netlify: "netlify",
  Hostinger: "hostinger",
  "GitHub Pages": "github",
  "VS Code": "vscode",
  ChatGPT: "chatgpt",
  Codex: "codex",
  Claude: "claude",
  OpenCode: "opencode",
  Playwright: "playwright",
};
const concepts: Record<string, typeof Database> = {
  "REST API": Webhook,
  WebSockets: Cable,
  Authentication: ShieldCheck,
  "UI/UX Design": PenTool,
  "Responsive Design": PanelsTopLeft,
  "Design Systems": Component,
  "Admin Dashboards": LayoutDashboard,
  CRM: ContactRound,
  CMS: Files,
  "Internal Tools": Wrench,
  "Business Applications": AppWindow,
  Networking: Network,
};
// Read geometry only when a tooltip is opened, keeping initial rendering unchanged.
function positionTooltip(element: HTMLButtonElement) {
  const tooltip = element.querySelector<HTMLElement>(".skill-tooltip");
  if (!tooltip) return;
  const bounds = element.getBoundingClientRect();
  const center = bounds.left + bounds.width / 2;
  const half = tooltip.getBoundingClientRect().width / 2;
  const clamped = Math.max(12 + half, Math.min(innerWidth - 12 - half, center));
  element.style.setProperty("--skill-tooltip-offset", `${clamped - center}px`);
}
export default function SkillIcon({ name }: { name: string }) {
  const [pinned, setPinned] = useState(false);
  const logo = logos[name];
  const Generic = concepts[name] || Database;
  return (
    <button
      type="button"
      className="skill-icon"
      aria-label={name}
      aria-pressed={pinned}
      onPointerEnter={(event) => positionTooltip(event.currentTarget)}
      onFocus={(event) => positionTooltip(event.currentTarget)}
      onClick={(event) => {
        positionTooltip(event.currentTarget);
        setPinned(!pinned);
      }}
      onBlur={() => setPinned(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") setPinned(false);
      }}
    >
      {logo ? (
        <span
          className="skill-glyph"
          aria-hidden="true"
          style={{ maskImage: `url(/icons/skills/${logo}.svg)` }}
        />
      ) : (
        <Generic size={24} aria-hidden="true" />
      )}
      <span className="skill-tooltip" aria-hidden="true">
        {name}
      </span>
    </button>
  );
}
