"use client";
import {
  ArrowUpRight,
  ArrowDown,
  Check,
  Code2,
  Server,
  ShieldCheck,
} from "lucide-react";
import { useIntroPlayback } from "@/hooks/useIntroPlayback";
import NetworkScene from "./NetworkScene";
export default function Hero() {
  const { playing: intro, started, skip } = useIntroPlayback();
  return (
    <section
      id="home"
      data-motion-scene="hero"
      data-intro={intro ? "playing" : "settled"}
      className="hero"
      aria-labelledby="hero-title"
    >
      {intro && (
        <button className="skip-intro" onClick={skip}>
          Skip intro
        </button>
      )}
      <div className="hero-meta">
        <span>
          <i /> Open to remote roles & freelance projects
        </span>
        <span>JOHN DE JOYA / PHILIPPINES · UTC+8</span>
      </div>
      <div className="hero-stage">
        <div className="hero-light" aria-hidden="true" />
        <NetworkScene playing={intro} started={started} />
        <div className="hero-wordmark" aria-hidden="true">
          J0hnvexcoder
        </div>
        <div className="portrait-halo" aria-hidden="true" />
        <div className="hero-portrait">
          <img
            src="/source/me/portrait.webp"
            srcSet="/source/me/portrait-320.webp 320w, /source/me/portrait-480.webp 480w, /source/me/portrait-640.webp 640w, /source/me/portrait.webp 960w"
            alt="John Angelo De Joya, J0hnvexcoder, holding his laptop"
            width={960}
            height={1200}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="(max-width:600px) min(77vw, 290px), (max-width:900px) 37svh, (max-height:850px) clamp(280px, 39svh, 335px), min(37svh, 430px)"
          />
        </div>
        <div className="hero-system system-interface" aria-hidden="true">
          <div className="system-label">
            <Code2 size={14} /> Interface / assembling
          </div>
          <div className="mini-interface">
            <div className="mini-chrome">
              <i />
              <i />
              <i />
            </div>
            <span />
            <div>
              <i />
              <i />
              <i />
            </div>
          </div>
          <span className="system-note">
            A clear experience, from the first click.
          </span>
        </div>
        <div className="hero-system system-infrastructure" aria-hidden="true">
          <div className="system-label">
            <Server size={14} /> Infrastructure / connected
          </div>
          <div className="mini-nodes">
            <span>HOST</span>
            <i />
            <span>VM</span>
            <i />
            <span>APP</span>
          </div>
          <span className="system-note">The system behind the software.</span>
        </div>
        <div className="hero-system system-workflow" aria-hidden="true">
          <div className="system-label">Automation / purposeful steps</div>
          <div className="mini-workflow">
            <span>TRIGGER</span>
            <i />
            <span>BUILD</span>
            <i />
            <span>
              <Check size={11} /> VERIFY
            </span>
          </div>
        </div>
        <div className="hero-system system-secure" aria-hidden="true">
          <ShieldCheck size={15} />
          <span>VERIFY · DEPLOY · UNDERSTAND</span>
        </div>
        <div className="hero-stage-foot">
          <span>
            WEB DEVELOPMENT
            <br />
            SOFTWARE & SYSTEMS
          </span>
          <span>
            INDEPENDENT PRACTICE
            <br />
            HUMAN-CENTERED ENGINEERING
          </span>
        </div>
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          WEB DEVELOPER · FULL-STACK · LINUX & INFRASTRUCTURE
        </p>
        <h1 id="hero-title">
          From interface
          <br />
          <span>to infrastructure.</span>
        </h1>
        <p className="hero-summary">
          Practical software and the self-hosted systems behind it.
          <br />
          From the browser interface to the Linux server.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            Explore Projects <ArrowUpRight size={16} />
          </a>
          <a className="button secondary" href="#contact">
            Let’s Connect <ArrowUpRight size={16} />
          </a>
        </div>
        <a
          className="hero-scroll"
          href="#introduction"
          aria-label="Explore the portfolio"
        >
          <ArrowDown size={15} />
        </a>
      </div>
    </section>
  );
}
