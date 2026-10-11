export const GA_MEASUREMENT_ID = "G-11E1T1HREX";

export const ANALYTICS_CONSENT_STORAGE_KEY = "j0hnvexcoder-analytics-consent";

export type AnalyticsConsent = "granted" | "denied";

/**
 * Consent Mode v2 defaults, injected before first paint. Analytics storage
 * stays denied until the visitor explicitly chooses. The Google tag is loaded
 * once from the root layout; this only declares the consent signal.
 */
export const analyticsBootstrap = `(()=>{window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments)}window.gtag=window.gtag||gtag;window.gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});window.gtag('set','url_passthrough',true);window.gtag('set','ads_data_redaction',true);window.gtag('js',new Date());})();`;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsParams = Record<
  string,
  string | number | boolean | undefined | null
>;

// Defensive guard: no visitor-supplied field may ever reach Google Analytics,
// even if a future caller passes one by mistake.
const personalDataKey =
  /^(name|full_?name|first_?name|last_?name|email|e_?mail|phone|telephone|mobile|message|subject|body|address|company|company_profession|project_url)$/i;

/**
 * Sends one custom GA4 event. Page views are intentionally not sent here:
 * GA4 tracks them (including client-side route changes) through Enhanced
 * Measurement, so a manual page_view would duplicate data.
 */
export function track(event: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    if (personalDataKey.test(key)) continue;
    safe[key] = value;
  }
  window.gtag("event", event, safe);
}

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

export function applyAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window === "undefined" || typeof window.gtag !== "function")
    return;
  window.gtag("consent", "update", { analytics_storage: value });
}

// A tiny external store so the consent banner reads browser storage through
// useSyncExternalStore instead of setting state inside an effect.
let consentSnapshot: AnalyticsConsent | null | undefined = undefined;
const consentListeners = new Set<() => void>();

export function subscribeAnalyticsConsent(listener: () => void) {
  consentListeners.add(listener);
  return () => {
    consentListeners.delete(listener);
  };
}

export function getAnalyticsConsentSnapshot(): AnalyticsConsent | null {
  if (consentSnapshot === undefined) consentSnapshot = readAnalyticsConsent();
  return consentSnapshot;
}

export function getAnalyticsConsentServerSnapshot(): undefined {
  return undefined;
}

export function updateAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window === "undefined") return;
  consentSnapshot = value;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
  } catch {
    // Storage may be unavailable (private mode); the choice still applies for
    // this page load.
  }
  applyAnalyticsConsent(value);
  for (const listener of consentListeners) listener();
}
