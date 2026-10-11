"use client";
import { ShieldCheck } from "lucide-react";
import type { AnalyticsConsent } from "@/lib/analytics";

export default function ConsentBanner({
  onChoice,
}: {
  onChoice: (value: AnalyticsConsent) => void;
}) {
  return (
    <section
      className="analytics-consent"
      aria-label="Analytics consent"
      role="region"
    >
      <ShieldCheck size={20} aria-hidden="true" />
      <p>
        I use Google Analytics to understand aggregate visits and which
        projects are useful. No names, emails or message contents are ever sent.
        Analytics storage stays off until you choose.
      </p>
      <div className="analytics-consent-actions">
        <button
          className="button secondary"
          type="button"
          onClick={() => onChoice("denied")}
        >
          Decline
        </button>
        <button
          className="button primary"
          type="button"
          onClick={() => onChoice("granted")}
        >
          Accept analytics
        </button>
      </div>
      <button
        className="text-link"
        type="button"
        onClick={() =>
          window.dispatchEvent(new CustomEvent("portfolio-privacy"))
        }
      >
        Privacy details
      </button>
    </section>
  );
}
