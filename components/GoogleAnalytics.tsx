"use client";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import {
  getAnalyticsConsentServerSnapshot,
  getAnalyticsConsentSnapshot,
  subscribeAnalyticsConsent,
  initializeAnalytics,
  track,
  updateAnalyticsConsent,
} from "@/lib/analytics";
import ConsentBanner from "./ConsentBanner";

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    getAnalyticsConsentServerSnapshot,
  );
  useEffect(() => {
    if (consent === "granted") initializeAnalytics(pathname);
  }, [consent, pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const element =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-ga-event]")
          : null;
      if (!element?.dataset.gaEvent) return;
      const data = element.dataset;
      track(data.gaEvent!, {
        project: data.gaProject,
        action: data.gaAction,
        location: data.gaLocation,
        network: data.gaNetwork,
        service: data.gaService,
      });
    };
    const onToggle = (event: Event) => {
      const element = event.target;
      if (
        element instanceof HTMLDetailsElement &&
        element.open &&
        element.classList.contains("archive-project")
      ) {
        track("project_explore", {
          project: element.dataset.gaProject,
          action: "Expand details",
          location: "project-archive",
        });
      }
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("toggle", onToggle, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);
  return consent === null ? (
    <ConsentBanner onChoice={updateAnalyticsConsent} />
  ) : null;
}
