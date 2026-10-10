"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUp, Terminal } from "lucide-react";
import Dialog from "./Dialog";
import { profile } from "@/lib/content";
export default function Footer() {
  const [open, setOpen] = useState(false),
    [command, setCommand] = useState(""),
    [history, setHistory] = useState([
      "Welcome to the portfolio terminal. Type help.",
    ]);
  const answers: Record<string, string> = {
    help: "Commands: whoami, projects, skills, contact, clear",
    whoami:
      "John Angelo De Joya / J0hnvexcoder. Web Developer · Linux & Infrastructure.",
    projects: "Explore the full project collection at /#projects.",
    skills:
      "Web development, Python, Linux, Docker, Proxmox, networking and automation.",
    contact: profile.email,
  };
  return (
    <>
      <footer className="site-footer" data-motion-scene="footer">
        <div>
          <Link className="footer-brand" href="/#home">
            J0hnvexcoder<span>CODE · SYSTEMS · SECURITY</span>
          </Link>
          <Link
            className="text-link footer-top"
            href="/#home"
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={13} />
          </Link>
        </div>
        <div>
          <p>
            © 2026{" "}
            <a
              href="https://github.com/johnvexcoder"
              target="_blank"
              rel="noopener noreferrer"
            >
              J0hnvexcoder
            </a>
            . All rights reserved.
          </p>
          <p>
            Designed &amp; Developed by{" "}
            <a
              href="https://johnvexcoder.github.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              J0hnvexcoder <ArrowUpRight size={12} />
            </a>
          </p>
          <button onClick={() => setOpen(true)} className="footer-terminal">
            <Terminal size={13} />
            Terminal
          </button>
          <a
            href="https://ko-fi.com/johnvexcoder"
            target="_blank"
            rel="noopener noreferrer"
          >
            Support on Ko-fi <ArrowUpRight size={12} />
          </a>
        </div>
      </footer>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="j0hn@portfolio:~"
      >
        <div className="terminal-content">
          <p>Decorative interface. Commands do not run on your computer.</p>
          <div role="log" aria-live="polite">
            {history.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const c = command.trim().toLowerCase();
              if (c === "clear") setHistory([]);
              else
                setHistory((h) => [
                  ...h.slice(-30),
                  `$ ${command}`,
                  answers[c] || "Unknown command. Type help.",
                ]);
              setCommand("");
            }}
          >
            <label htmlFor="terminal-input">$</label>
            <input
              id="terminal-input"
              maxLength={160}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              aria-label="Terminal command"
              autoComplete="off"
              spellCheck={false}
            />
          </form>
        </div>
      </Dialog>
    </>
  );
}
