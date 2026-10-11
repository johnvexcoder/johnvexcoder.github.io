"use client";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";
import {
  GA_MEASUREMENT_ID,
  applyAnalyticsConsent,
  getAnalyticsConsentServerSnapshot,
  getAnalyticsConsentSnapshot,
  subscribeAnalyticsConsent,
  track,
  updateAnalyticsConsent,
} from "@/lib/analytics";
import ConsentBanner from "./ConsentBanner";

// The public measurement ID is baked into every page. Local development keeps
// the consent UI and event wiring, but does not send data to the live property.
const analyticsEnabled = process.env.NODE_ENV === "production";

export default function GoogleAnalytics() {
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );

  useEffect(() => {
    if (consent) applyAnalyticsConsent(consent);
  }, [consent]);

  useEffect(() => {
    // One delegated listener covers links rendered by server components too,
    // so the Google tag stays installed once without per-link bundles.
    const onClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const element = target?.closest?.(
        "[data-ga-event]",
      ) as HTMLElement | null;
      const data = element?.dataset;
      if (!data?.gaEvent) return;
      track(data.gaEvent, {
        project: data.gaProject,
        action: data.gaAction,
        location: data.gaLocation,
        network: data.gaNetwork,
        service: data.gaService,
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <>
      {analyticsEnabled && (
        <>
          <Script
            id="ga4-google-tag"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`window.gtag('config','${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
      {consent === null && (
        <ConsentBanner
          onChoice={(value) => {
            updateAnalyticsConsent(value);
          }}
        />
      )}
    </>
  );
}
