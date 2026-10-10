"use client";
import { useState } from "react";
import { Database, Network } from "lucide-react";
const logos: Record<string, string> = {
  HTML: "html5",
  CSS: "css3",
  JavaScript: "javascript",
  "Next.js": "nextjs",
  React: "react",
  TypeScript: "typescript",
  "Node.js": "nodejs",
  Python: "python",
  Java: "java",
  WordPress: "wordpress",
  "Tailwind CSS": "tailwindcss",
  "Framer Motion": "framermotion",
  Zustand: "zustand",
  Linux: "linux",
  Docker: "docker",
  Proxmox: "proxmox",
  Nginx: "nginx",
  Tailscale: "tailscale",
  Bash: "bash",
  SQLite: "sqlite",
  PostgreSQL: "postgresql",
  Redis: "redis",
  Zod: "zod",
  Git: "git",
  GitHub: "github",
  Vercel: "vercel",
};
export default function SkillIcon({ name }: { name: string }) {
  const [pinned, setPinned] = useState(false);
  const logo = logos[name];
  const Generic = name === "Networking" ? Network : Database;
  return (
    <button
      type="button"
      className="skill-icon"
      aria-label={name}
      aria-pressed={pinned}
      onClick={() => setPinned(!pinned)}
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
