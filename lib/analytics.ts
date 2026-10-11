import {
  GA_MEASUREMENT_ID,
  ANALYTICS_ORIGIN,
  ANALYTICS_SCRIPT_ID,
  ANALYTICS_COOKIE_PREFIX,
  ANALYTICS_CONSENT_STORAGE_KEY,
  analyticsPages,
  projectIds,
} from "./analytics-config.mjs";
export {
  GA_MEASUREMENT_ID,
  ANALYTICS_CONSENT_STORAGE_KEY,
} from "./analytics-config.mjs";
export type AnalyticsConsent = "granted" | "denied";
export type AnalyticsParams = Record<string, unknown>;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}
const choices = (value: string | null): AnalyticsConsent | null =>
  value === "granted" || value === "denied" ? value : null;

// URLs/titles come only from the public catalog, never query strings, hashes,
// document.title, form values, user-generated paths or full outbound URLs.
export function analyticsPage(path: string) {
  const clean = path.split(/[?#]/)[0];
  const normalized = clean.endsWith("/") ? clean : `${clean}/`;
  const route = Object.hasOwn(analyticsPages, normalized)
    ? normalized
    : "/404/";
  return {
    page_location: ANALYTICS_ORIGIN + route,
    page_title: analyticsPages[route],
  };
}
export function safeReferrer(value: string) {
  try {
    const url = new URL(value);
    return /^(https?:)$/.test(url.protocol) ? url.origin : "";
  } catch {
    return "";
  }
}
const enums: Record<string, Set<string>> = {
  action: new Set([
    "Live site",
    "Local demo",
    "Self-hosted demo",
    "Repository",
    "Documentation",
    "Releases",
    "Case study",
    "Expand details",
  ]),
  location: new Set([
    "featured-build",
    "project-archive",
    "case-study",
    "contact",
    "header",
    "footer",
    "privacy",
    "services",
  ]),
  network: new Set([
    "LinkedIn",
    "GitHub",
    "WhatsApp",
    "Telegram",
    "X / Twitter",
  ]),
  method: new Set(["email_app"]),
  service: new Set([
    "Website project",
    "Maintenance or automation",
    "Infrastructure and deployment",
    "Technical support",
    "Portfolio Website",
    "Business Website",
    "Web Development",
    "WordPress",
    "E-Commerce",
    "Website Maintenance",
    "UI / Web Design",
    "Infrastructure / Deployment",
    "Technical Support",
    "Other",
  ]),
};
const eventKeys: Record<string, string[]> = {
  project_demo: ["project", "action", "location"],
  project_reference: ["project", "action", "location"],
  project_explore: ["project", "action", "location"],
  contact_email_click: ["location"],
  contact_social_click: ["network", "location"],
  contact_email_prepare: ["method"],
  contact_copy_email: ["location"],
  resume_download: ["location"],
  service_enquiry: ["service", "location"],
  review_submitted: ["service"],
  terminal_open: ["location"],
  support_click: ["location"],
  privacy_open: ["location"],
};
export function safeEvent(event: string, params: AnalyticsParams) {
  if (!Object.hasOwn(eventKeys, event)) return null;
  const safe: Record<string, string> = {};
  for (const key of eventKeys[event]) {
    const value = params[key];
    if (typeof value !== "string") continue;
    if ((key === "project" && projectIds.has(value)) || enums[key]?.has(value))
      safe[key] = value;
  }
  return safe;
}

// A small injectable controller makes the actual lifecycle testable without
// loading Google's tag or sending test traffic to the production property.
export function createAnalyticsController({
  getWindow = () => (typeof window === "undefined" ? undefined : window),
  production = process.env.NODE_ENV === "production",
}: { getWindow?: () => Window | undefined; production?: boolean } = {}) {
  let consent: AnalyticsConsent | null | undefined;
  let initialized = false;
  let lastPage = "";
  const listeners = new Set<() => void>();
  const disabledKey = `ga-disable-${GA_MEASUREMENT_ID}` as const;
  const read = () => {
    try {
      return choices(
        getWindow()?.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY) ??
          null,
      );
    } catch {
      return null;
    }
  };
  const snapshot = () => {
    if (consent === undefined) consent = read();
    return consent;
  };
  const notify = () => {
    for (const listener of listeners) listener();
  };
  const allowedHost = () => {
    const w = getWindow();
    return !!w && production && w.location.origin === ANALYTICS_ORIGIN;
  };
  const clearCookies = () => {
    const w = getWindow();
    if (!w) return;
    // Only this integration's cookies, including the known previous tag's names.
    const names = w.document.cookie
      .split(";")
      .map((p) => p.trim().split("=")[0])
      .filter(
        (n) =>
          n === "_ga" ||
          n === `_ga_${GA_MEASUREMENT_ID.slice(2)}` ||
          n === `${ANALYTICS_COOKIE_PREFIX}_ga` ||
          n.startsWith(`${ANALYTICS_COOKIE_PREFIX}_ga_`),
      );
    const paths = new Set([
      "/",
      ...w.location.pathname
        .split("/")
        .filter(Boolean)
        .map((_, i, parts) => "/" + parts.slice(0, i + 1).join("/") + "/"),
    ]);
    for (const name of names)
      for (const path of paths)
        for (const domain of [
          "",
          w.location.hostname,
          `.${w.location.hostname}`,
        ]) {
          w.document.cookie = `${name}=; Max-Age=0; path=${path};${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
        }
  };
  const stop = () => {
    const w = getWindow();
    if (!w) return;
    w[disabledKey] = true; // Synchronous block before cookie cleanup or reload.
    clearCookies();
    w.document.getElementById(ANALYTICS_SCRIPT_ID)?.remove();
    if (initialized) {
      w.dataLayer?.splice(0);
      initialized = false;
      lastPage = "";
      // The loaded third-party library cannot be reliably unloaded. Reload the
      // current location after persisting withdrawal to terminate its timers.
      w.location.reload();
    }
  };
  const update = (value: AnalyticsConsent) => {
    if (value !== "granted" && value !== "denied") return;
    consent = value;
    try {
      getWindow()?.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, value);
    } catch {
      /* session-only choice */
    }
    if (value === "denied") stop();
    notify();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY && event.key !== null)
      return;
    const next = read();
    if (next === consent) return;
    consent = next;
    if (next !== "granted") stop();
    notify();
  };
  const subscribe = (listener: () => void) => {
    if (!listeners.size) getWindow()?.addEventListener("storage", onStorage);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
      if (!listeners.size)
        getWindow()?.removeEventListener("storage", onStorage);
    };
  };
  const initialize = (path: string) => {
    const w = getWindow();
    if (!w || snapshot() !== "granted" || !allowedHost()) return false;
    const page = analyticsPage(path);
    if (!initialized) {
      w[disabledKey] = false;
      w.dataLayer = w.dataLayer || [];
      w.gtag = function (...args: unknown[]) {
        w.dataLayer!.push(args);
      };
      // Nothing in this queue exists before opt-in, and the tag is appended last.
      w.gtag("consent", "default", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      w.gtag("set", {
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        ...page,
        page_referrer: safeReferrer(w.document.referrer),
      });
      w.gtag("js", new Date());
      w.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
        cookie_prefix: ANALYTICS_COOKIE_PREFIX,
        cookie_domain: "none",
        ...page,
        page_referrer: safeReferrer(w.document.referrer),
      });
      initialized = true;
      if (!w.document.getElementById(ANALYTICS_SCRIPT_ID)) {
        const script = w.document.createElement("script");
        script.id = ANALYTICS_SCRIPT_ID;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
        w.document.head.appendChild(script);
      }
    }
    if (page.page_location !== lastPage) {
      w.gtag?.("set", {
        ...page,
        page_referrer: lastPage || safeReferrer(w.document.referrer),
      });
      w.gtag?.("event", "page_view", {
        ...page,
        page_referrer: lastPage || safeReferrer(w.document.referrer),
        send_to: GA_MEASUREMENT_ID,
      });
      lastPage = page.page_location;
    }
    return true;
  };
  const trackEvent = (event: string, params: AnalyticsParams = {}) => {
    const w = getWindow(),
      safe = safeEvent(event, params);
    if (
      !w ||
      !initialized ||
      snapshot() !== "granted" ||
      !allowedHost() ||
      w[disabledKey] ||
      !safe
    )
      return;
    w.gtag?.("event", event, { ...safe, send_to: GA_MEASUREMENT_ID });
  };
  return { snapshot, subscribe, update, initialize, track: trackEvent };
}
const controller = createAnalyticsController();
export const getAnalyticsConsentSnapshot = controller.snapshot;
export const getAnalyticsConsentServerSnapshot = () => undefined;
export const subscribeAnalyticsConsent = controller.subscribe;
export const updateAnalyticsConsent = controller.update;
export const initializeAnalytics = controller.initialize;
export const track = controller.track;
