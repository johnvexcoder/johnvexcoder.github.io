"use client";
import {
  ArrowUpRight,
  Code2,
  Search,
  Layers,
  UserRound,
  CalendarDays,
  Workflow,
} from "lucide-react";
import { profile, skills, tagline } from "@/lib/content";
import Link from "next/link";
import services from "@/content/service-routes.json";
import { track } from "@/lib/analytics";
import Reveal from "./Reveal";
import SkillIcon from "./SkillIcon";
const serviceIcons = [Code2, Search, Layers, UserRound, CalendarDays, Workflow];
export function Skills() {
  return (
    <section id="skills" className="section skills-section">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">06 / SKILLS & EXPERTISE</p>
          <h2>
            Tools with
            <br />
            <span>a purpose.</span>
          </h2>
        </div>
        <p>
          Technologies applied across software projects, websites, and home
          infrastructure. Chosen for the problem.
        </p>
      </Reveal>
      <div className="skills-groups">
        {Object.entries(skills).map(([name, items], i) => (
          <Reveal className="skill-group" key={name}>
            <span>0{i + 1}</span>
            <h3>{name}</h3>
            <div>
              {items.map((s) => (
                <SkillIcon key={s} name={s} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
export function Experience() {
  return (
    <section id="experience" className="section experience-section">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">07 / PROFESSIONAL EXPERIENCE</p>
          <h2>
            Real work.
            <br />
            <span>Real responsibility.</span>
          </h2>
        </div>
        <p>
          Workplace IT responsibilities, client delivery, and sustained hands-on
          work in software and infrastructure.
        </p>
      </Reveal>
      <div className="experience-layout">
        <div className="timeline">
          {profile.experience.map((e) => (
            <Reveal key={e.date} className="timeline-entry">
              <span>{e.date}</span>
              <div>
                <h3>{e.title}</h3>
                <strong>{e.place}</strong>
                <p>{e.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="independent-work">
          <p className="eyebrow">INDEPENDENT TECHNICAL WORK</p>
          <h3>
            Experience built
            <br />
            through ownership.
          </h3>
          <p>
            Personal projects have required me to plan, build, deploy, debug,
            document, and maintain complete systems.
          </p>
          <ul>
            {[
              "Homelab administration",
              "Open-source development",
              "Linux server management",
              "Independent web development",
              "Self-hosted infrastructure",
            ].map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <small>
            First information security certification in progress.
            <br />
            This is a learning path, not a completed certification.
          </small>
        </Reveal>
      </div>
    </section>
  );
}
export function Services() {
  return (
    <section id="services" className="section services-section">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">08 / WORK WITH ME</p>
          <h2>
            From the website
            <br />
            <span>to the server.</span>
          </h2>
        </div>
        <p>
          Focused work shaped around the actual problem, without unnecessary
          complexity.
        </p>
      </Reveal>
      <div className="services-list">
        {services.map(({ id, name, summary: copy, route }, i) => {
          const enquiry =
            id === "custom-solutions"
              ? "Maintenance or automation"
              : "Website project";
          const Icon = serviceIcons[i];
          return (
            <Reveal key={name} className="service">
              <span className="service-number">0{i + 1}</span>
              <Icon size={26} />
              <h3>{name}</h3>
              <p>{copy}</p>
              <div className="service-home-actions">
                <Link className="text-link" href={route}>
                  Explore service <ArrowUpRight size={15} />
                </Link>
                <a
                  className="text-link"
                  href="#contact"
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("portfolio-enquiry", { detail: id }),
                    );
                    track("service_enquiry", {
                      service: enquiry,
                      location: "services",
                    });
                  }}
                >
                  Discuss your project
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </Reveal>
          );
        })}
      </div>
      <div className="services-home-footer">
        <Link className="text-link" href="/services/">
          Explore Services and Solutions <ArrowUpRight size={15} />
        </Link>
        <Link className="text-link" href="/services/#website-care">
          Website Care and Maintenance <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
export function About() {
  return (
    <section id="about" className="section about-section">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">10 / THE PERSON BEHIND THE BUILD</p>
          <h2>
            Curiosity,
            <br />
            <span>put into practice.</span>
          </h2>
        </div>
        <p>
          John Angelo De Joya.
          <br />
          Developer. Systems builder. Always learning.
        </p>
      </Reveal>
      <div className="about-layout">
        <Reveal className="about-photo">
          {/* Static export: use prebuilt responsive files without an image server. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/source/me/john_aboutme.webp"
            srcSet="/source/me/john_aboutme-480.webp 480w, /source/me/john_aboutme-768.webp 768w, /source/me/john_aboutme.webp 1000w"
            alt="John Angelo De Joya working at his desk with a laptop"
            width={1000}
            height={1250}
            sizes="(max-width: 700px) 90vw, 40vw"
            decoding="async"
            loading="lazy"
          />
          <span>JOHN DE JOYA / J0HNVEXCODER</span>
        </Reveal>
        <Reveal className="about-copy">
          <blockquote className="about-philosophy">
            <span
              className="philosophy-mark philosophy-open"
              aria-hidden="true"
            >
              “
            </span>
            <span className="philosophy-words">{tagline}</span>
            <span
              className="philosophy-mark philosophy-close"
              aria-hidden="true"
            >
              ”
            </span>
          </blockquote>
          <p className="lead">
            I’m John Angelo De Joya, also known as John De Joya. I publish my
            work as J0hnvexcoder, using the handle johnvexcoder. Based in
            Bulacan, Philippines, I work across full-stack application
            development, Linux, and self-hosted infrastructure.
          </p>
          <p>
            My formal degree is in Hospitality Management — but my technical
            experience comes from real projects, client work, and building and
            operating my own systems. I learned through self-study,
            experimentation, and work that solves actual problems rather than
            theory alone.
          </p>
          <p>
            I’m currently building my first server cluster, studying network
            architecture and service communication, and continuing to learn
            information security fundamentals.
          </p>
          <div className="about-values">
            <span>Reliable</span>
            <span>Useful</span>
            <span>Secure</span>
            <span>Practical</span>
          </div>
          <div className="qualifications">
            <p className="eyebrow">QUALIFICATIONS & MILESTONES</p>
            {[
              ["Youth Leadership Award", "2024 — 2025"],
              ["Bachelor of Science in Hospitality Management", "2024 — 2025"],
              ["NC II Bartending", "2023"],
              ["NC II Bread and Pastry", "2024"],
            ].map(([n, d]) => (
              <div key={n}>
                <strong>{n}</strong>
                <span>{d}</span>
              </div>
            ))}
          </div>
          <p className="personal-note">
            Away from the keyboard: DJing, EDM and music production, cooking,
            family, and quiet time.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
