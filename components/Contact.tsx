"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { contacts, profile } from "@/lib/content";
import { track } from "@/lib/analytics";
import Reveal from "./Reveal";
export default function Contact() {
  const [subject, setSubject] = useState(""),
    [status, setStatus] = useState(""),
    [copied, setCopied] = useState(false);
  useEffect(() => {
    const listener = (e: Event) =>
      setSubject((e as CustomEvent<string>).detail);
    window.addEventListener("portfolio-enquiry", listener);
    return () => window.removeEventListener("portfolio-enquiry", listener);
  }, []);
  return (
    <section id="contact" className="section contact-section">
      <Reveal className="contact-copy">
        <p className="eyebrow">11 / LET’S CONNECT</p>
        <h2>
          Have something
          <br />
          <span>in mind?</span>
        </h2>
        <p>
          A website idea. A software project. An infrastructure challenge. Let’s
          talk about what you’re building.
        </p>
        <a
          className="contact-email"
          href={`mailto:${profile.email}`}
          data-ga-event="contact_email_click"
          data-ga-location="contact"
        >
          {profile.email}
          <ArrowUpRight size={23} />
        </a>
        <div className="contact-socials">
          {contacts.slice(1).map(([name, url, text]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}: ${text}`}
              data-ga-event="contact_social_click"
              data-ga-network={name}
              data-ga-location="contact"
            >
              {name}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </div>
        <a
          className="text-link"
          href="/resume.pdf"
          download
          data-ga-event="resume_download"
          data-ga-location="contact"
        >
          Download résumé <ArrowUpRight size={14} />
        </a>
        <p className="contact-note">
          Based in the Philippines · UTC+8
          <br />
          Email is the easiest way to start.
        </p>
      </Reveal>
      <Reveal className="contact-form-wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
            window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject || "Portfolio enquiry")}&body=${encodeURIComponent(body)}`;
            track("contact_email_prepare", { method: "email_app" });
            setStatus(
              "Your email application will open with the message prepared. Send it there when you’re ready.",
            );
          }}
        >
          <div className="form-row">
            <label>
              Name
              <input name="name" autoComplete="name" required maxLength={100} />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label>
            Subject
            <input
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={160}
            />
          </label>
          <label>
            What are you building?
            <textarea name="message" rows={5} required maxLength={2500} />
          </label>
          <button className="button primary" type="submit">
            Compose Email <ArrowUpRight size={16} />
          </button>
          <p className="form-note">
            Opens your email application. Nothing is stored or sent by this
            website.
          </p>
          <button
            className="copy-email"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(profile.email);
                setCopied(true);
                setStatus("Email address copied.");
                track("contact_copy_email", { location: "contact" });
              } catch {
                setStatus(`Please copy: ${profile.email}`);
              }
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
            {copied ? "Email copied" : "Copy email address"}
          </button>
          <p className="form-status" role="status">
            {status}
          </p>
        </form>
      </Reveal>
    </section>
  );
}
