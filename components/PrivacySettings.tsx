"use client";
import { useSyncExternalStore } from "react";
import Dialog from "./Dialog";
import {
  getAnalyticsConsentSnapshot,
  getAnalyticsConsentServerSnapshot,
  subscribeAnalyticsConsent,
  updateAnalyticsConsent,
} from "@/lib/analytics";
export default function PrivacySettings({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );
  const choose = (value: "granted" | "denied") => {
    updateAnalyticsConsent(value);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Your privacy choices"
      className="privacy-dialog"
      description="privacy-summary"
      fallbackFocusSelector="[data-privacy-settings]"
    >
      <div className="privacy-content">
        <p id="privacy-summary" className="privacy-intro">
          A portfolio to explore. Analytics you can choose.
        </p>
        <section>
          <h3>What analytics helps me understand</h3>
          <p>
            This site uses Google Analytics 4 to understand aggregate visits,
            popular projects, demo and repository clicks, and contact-link
            interactions. Analytics is optional; declining keeps every portfolio
            feature available.
          </p>
        </section>
        <section>
          <h3>What your choice means</h3>
          <p>
            Accepting loads Google’s analytics service and lets it use
            first-party analytics cookies. Before you accept, or if you decline,
            this site does not load that service or send analytics events.
          </p>
          <p>
            Your choice is remembered in this browser using local storage. If
            storage is unavailable, it applies for this visit and may be asked
            again after a refresh.
          </p>
        </section>
        <section>
          <h3>Information and safeguards</h3>
          <p>
            Google may process technical information from analytics requests,
            such as your IP address and browser or device information. This site
            is designed not to include visitor names, emails, phone numbers,
            message contents, or other personal details in analytics event
            parameters. Tracked page addresses omit search terms and URL
            fragments.
          </p>
          <p>
            The contact form prepares a message in your email app; it does not
            confirm delivery. Reviews use Web3Forms separately from analytics.
          </p>
          <a
            className="text-link"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s privacy practices ↗
          </a>
        </section>
        <section>
          <h3>Change your mind at any time</h3>
          <p>
            Reopen Privacy Settings in the footer to change your choice.
            Declining after accepting stops tracking, removes this site’s
            analytics cookies, and reloads the current page to stop the loaded
            service. Information already sent cannot be recalled by this
            control.
          </p>
        </section>
      </div>
      <div className="privacy-preferences">
        <p role="status" aria-live="polite">
          Analytics:{" "}
          <strong>
            {consent === "granted"
              ? "accepted"
              : consent === "denied"
                ? "declined"
                : "not chosen"}
          </strong>
        </p>
        <div className="analytics-consent-actions">
          <button
            className="privacy-choice"
            type="button"
            aria-pressed={consent === "granted"}
            onClick={() => choose("granted")}
          >
            Accept Analytics
          </button>
          <button
            className="privacy-choice"
            type="button"
            aria-pressed={consent === "denied"}
            onClick={() => choose("denied")}
          >
            Decline
          </button>
        </div>
      </div>
    </Dialog>
  );
}
