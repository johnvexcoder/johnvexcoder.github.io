"use client";
/* eslint-disable @next/next/no-img-element -- Reuse the static app SVG directly on static hosting. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ArrowUpRight, Sun, Moon, Github } from "lucide-react";
import { navigation } from "@/lib/content";
import Dialog from "./Dialog";
export default function Header() {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false),
    [quick, setQuick] = useState(false),
    [query, setQuery] = useState(""),
    [light, setLight] = useState(false);
  useEffect(() => {
    try {
      const chosen = localStorage.getItem("signature-v2-theme");
      if (chosen === "light") {
        document.documentElement.dataset.theme = "light";
        setLight(true);
      }
    } catch {}
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setQuick((v) => !v);
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
    };
  }, [pathname]);
  const destinations: Record<string, string> = {
    projects: "/work/",
    about: "/about/",
    services: "/services/",
    contact: "/contact/",
  };
  const href = (id: string) =>
    destinations[id] ?? (pathname === "/" ? `#${id}` : `/#${id}`);
  return (
    <>
      <header className="site-header">
        <div className="reading-progress" aria-hidden="true" />
        <Link className="brand" href="/#home">
          <img
            className="brand-mark brand-icon"
            src="/icon.svg"
            width={38}
            height={38}
            alt=""
            aria-hidden="true"
          />
          <span>
            <strong>J0hnvexcoder</strong>
            <small>CODE · SYSTEMS · SECURITY</small>
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          {[
            ["Works", "projects"],
            ["Services", "services"],
            ["About", "about"],
            ["Contact", "contact"],
          ].map(([name, id]) => (
            <a
              key={id}
              href={href(id)}
              aria-current={
                destinations[id] && pathname.startsWith(destinations[id])
                  ? "page"
                  : undefined
              }
            >
              {name}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="icon-button"
            aria-label="Open quick navigation"
            onClick={() => setQuick(true)}
          >
            <Search size={17} />
          </button>
          <a
            className="icon-button github-action"
            href="https://github.com/johnvexcoder"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            data-ga-event="contact_social_click"
            data-ga-network="GitHub"
            data-ga-location="header"
          >
            <Github size={18} />
          </a>
          <button
            className="icon-button"
            aria-label={`Switch to ${light ? "dark" : "light"} theme`}
            onClick={() => {
              const next = !light;
              setLight(next);
              document.documentElement.dataset.theme = next ? "light" : "dark";
              try {
                localStorage.setItem(
                  "signature-v2-theme",
                  next ? "light" : "dark",
                );
              } catch {}
            }}
          >
            {light ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <button
            className="icon-button menu-button explore-button"
            aria-label="Open navigation"
            aria-expanded={menu}
            onClick={() => setMenu(true)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
      <Dialog open={menu} onClose={() => setMenu(false)} title="Explore">
        <nav className="mobile-navigation" aria-label="Mobile navigation">
          {navigation.map(([name, id], i) => (
            <a key={id} href={href(id)} onClick={() => setMenu(false)}>
              <span aria-hidden="true">0{i + 1}</span>
              {name}
              <ArrowUpRight size={18} />
            </a>
          ))}
        </nav>
        <p className="dialog-foot">John De Joya · Philippines / UTC+8</p>
      </Dialog>
      <Dialog
        open={quick}
        onClose={() => setQuick(false)}
        title="Quick navigation"
      >
        <div className="quick-navigation">
          <label htmlFor="quick-search">Find a section</label>
          <input
            id="quick-search"
            autoFocus
            type="search"
            autoComplete="off"
            placeholder="Projects, experience, contact…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <nav>
            {navigation
              .filter(([n]) => n.toLowerCase().includes(query.toLowerCase()))
              .map(([name, id]) => (
                <a key={id} href={href(id)} onClick={() => setQuick(false)}>
                  {name}
                  <ArrowUpRight size={17} />
                </a>
              ))}
          </nav>
          {!navigation.some(([n]) =>
            n.toLowerCase().includes(query.toLowerCase()),
          ) && <p>No matching sections.</p>}
          <small>Tab to choose · Escape to close · Ctrl / ⌘ K to open</small>
        </div>
      </Dialog>
    </>
  );
}
