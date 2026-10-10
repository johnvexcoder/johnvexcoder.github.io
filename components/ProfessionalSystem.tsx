"use client";
import { useState } from "react";
import { Code2, Workflow, Server, Activity } from "lucide-react";
import { profile } from "@/lib/content";
import Reveal from "./Reveal";
const icons = [Code2, Workflow, Server, Activity];
const steps = [
  ["Understand", "Shape", "Align", "Validate"],
  ["Model", "Implement", "Test", "Integrate"],
  ["Provision", "Connect", "Deploy", "Verify"],
  ["Observe", "Diagnose", "Improve", "Document"],
];
export default function ProfessionalSystem() {
  const [index, setIndex] = useState(0);
  const capability = profile.capabilities[index];
  return (
    <section id="system" className="section professional-system">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">05 / PROFESSIONAL SYSTEM</p>
          <h2>
            Every layer
            <br />
            <span>matters.</span>
          </h2>
        </div>
        <p>
          A website is a starting point. A complete experience connects people,
          software, and the infrastructure that keeps it working.
        </p>
      </Reveal>
      <div className="professional-layout">
        <div
          data-motion-scene="system"
          data-layer={index}
          className="system-map"
        >
          <div className="system-map-title">
            <span className="eyebrow">SELECT A CONNECTED LAYER</span>
            <span>PERSON → PRODUCT → SYSTEM</span>
          </div>
          <svg viewBox="0 0 540 420" aria-hidden="true">
            <circle cx="270" cy="210" r="150" className="system-orbit" />
            <path
              className="system-spokes"
              d="M270 210L115 105 M270 210L425 105 M270 210L115 315 M270 210L425 315"
            />
            {[0, 1, 2, 3].map((i) => (
              <path
                key={i}
                className={`system-active-path path-${i}`}
                pathLength={1}
                d={`M270 210 L${i % 2 ? 425 : 115} ${i < 2 ? 105 : 315}`}
              />
            ))}
          </svg>
          <div className="map-center" aria-hidden="true">
            <span>J0</span>
            <small>
              CONNECTED
              <br />
              PRACTICE
            </small>
          </div>
          {profile.capabilities.map((c, i) => {
            const Icon = icons[i];
            return (
              <button
                className={`layer-button layer-button-${i}`}
                key={c.id}
                onClick={() => setIndex(i)}
                aria-pressed={index === i}
                aria-controls="system-detail"
              >
                <Icon size={20} />
                <small>{c.code}</small>
                <strong>{c.label}</strong>
              </button>
            );
          })}
        </div>
        <div
          className="professional-reader"
          id="system-detail"
          aria-live="polite"
        >
          <div className="state-reader" key={index}>
            <p className="eyebrow">
              LAYER {capability.code} / {capability.label}
            </p>
            <h3>{capability.title}</h3>
            <p>{capability.copy}</p>
            <div className="technology-tags">
              {capability.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div
              className="work-sequence"
              aria-label={`${capability.label} illustrative workflow`}
            >
              {steps[index].map((s, i) => (
                <div key={s} style={{ animationDelay: `${i * 1.25}s` }}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <strong>{s}</strong>
                  <i />
                </div>
              ))}
            </div>
            <small className="system-disclosure">
              An illustration of the working process, not a live production
              status.
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}
