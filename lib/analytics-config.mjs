import catalog from "../content/analytics-catalog.json" with { type: "json" };

// Public measurement identifier, not a credential. Never render it in privacy copy.
export const GA_MEASUREMENT_ID = "G-11E1T1HREX";
export const ANALYTICS_ORIGIN = "https://johnvexcoder.github.io";
export const ANALYTICS_CONSENT_STORAGE_KEY = "j0hnvexcoder-analytics-consent";
export const ANALYTICS_SCRIPT_ID = "portfolio-ga4";
export const ANALYTICS_COOKIE_PREFIX = "j0portfolio";
/** @type {Record<string, string>} */
export const analyticsPages = catalog.pages;
export const projectIds = new Set(catalog.projectIds);
