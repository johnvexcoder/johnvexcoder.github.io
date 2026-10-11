"use client";
import { useEffect, useRef, useState } from "react";
import type { AnalyticsConsent } from "@/lib/analytics";
export default function ConsentBanner({
  onChoice,
}: {
  onChoice: (value: AnalyticsConsent) => void;
}) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const choose = (value: AnalyticsConsent) => {
    if (leaving) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onChoice(value);
      return;
    }
    setLeaving(true);
    timer.current = setTimeout(() => onChoice(value), 150);
  };
  return (
    <section
      className={`analytics-consent${leaving ? " is-leaving" : ""}`}
      aria-labelledby="analytics-choice-heading"
    >
      <div className="analytics-consent-copy">
        <p className="analytics-kicker">YOUR VISIT. YOUR CHOICE.</p>
        <h2 id="analytics-choice-heading">Optional analytics</h2>
        <p>
          Help me understand which pages and projects are useful. Analytics
          starts only if you accept.
        </p>
        <button
          className="privacy-details-link"
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("portfolio-privacy"))
          }
        >
          Privacy details
        </button>
      </div>
      <div className="analytics-consent-actions">
        <button
          className="privacy-choice"
          type="button"
          disabled={leaving}
          onClick={() => choose("granted")}
        >
          Accept Analytics
        </button>
        <button
          className="privacy-choice"
          type="button"
          disabled={leaving}
          onClick={() => choose("denied")}
        >
          Decline
        </button>
      </div>
    </section>
  );
}
