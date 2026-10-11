"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowUp, Terminal, ShieldCheck } from "lucide-react";
import Dialog from "./Dialog";
import { profile } from "@/lib/content";
export default function Footer() {
  const [open, setOpen] = useState(false),
    [privacy, setPrivacy] = useState(false),
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
  useEffect(() => {
    const listener = () => setPrivacy(true);
    window.addEventListener("portfolio-privacy", listener);
    return () => window.removeEventListener("portfolio-privacy", listener);
  }, []);
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
              data-ga-event="contact_social_click"
              data-ga-network="GitHub"
              data-ga-location="footer"
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
          <button
            onClick={() => setOpen(true)}
            className="footer-terminal"
            data-ga-event="terminal_open"
            data-ga-location="footer"
          >
            <Terminal size={13} />
            Terminal
          </button>
          <a
            href="https://ko-fi.com/johnvexcoder"
            target="_blank"
            rel="noopener noreferrer"
            data-ga-event="support_click"
            data-ga-location="footer"
          >
            Support on Ko-fi <ArrowUpRight size={12} />
          </a>
          <button
            className="footer-terminal"
            onClick={() => setPrivacy(true)}
            data-ga-event="privacy_open"
            data-ga-location="footer"
          >
            <ShieldCheck size={13} />
            Privacy
          </button>
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
      <Dialog
        open={privacy}
        onClose={() => setPrivacy(false)}
        title="Privacy & analytics"
      >
        <div className="privacy-content">
          <p>
            This portfolio is a static website. It has no accounts, no database
            and no advertising trackers. The only analytics is the Google
            Analytics 4 property described here.
          </p>
          <h3>What is measured</h3>
          <p>
            Google Analytics 4 (measurement ID <code>G-11E1T1HREX</code>) helps
            me understand aggregate traffic — which pages and projects are
            useful — so I can improve the site. It records page views and the
            interactions you trigger, such as opening a project demo or using
            the contact links.
          </p>
          <h3>What is never sent</h3>
          <p>
            Names, email addresses, message contents and any other personal
            information are never sent to Google Analytics from this site. The
            contact form only prepares a message in your own email application,
            and reviews are delivered through Web3Forms, not analytics.
          </p>
          <h3>Your choice</h3>
          <p>
            Analytics storage is denied until you accept it. You can decline and
            keep browsing. If you decline, Google may still receive cookieless,
            aggregated signals without new analytics identifiers; if you accept,
            Google may set analytics cookies. Your choice is stored in your
            browser under <code>j0hnvexcoder-analytics-consent</code>; clear your
            browser storage to be asked again.
          </p>
          <h3>Contact</h3>
          <p>
            Questions about this notice? Email{" "}
            <a
              className="text-link"
              href={`mailto:${profile.email}`}
              data-ga-event="contact_email_click"
              data-ga-location="privacy"
            >
              {profile.email}
            </a>
            .
          </p>
        </div>
      </Dialog>
    </>
  );
}
