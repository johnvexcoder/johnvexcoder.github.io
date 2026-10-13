import services from "../content/service-routes.json" with { type: "json" };
import projects from "../content/projects.json" with { type: "json" };

// Public measurement identifier, not a credential. Never render it in privacy copy.
export const GA_MEASUREMENT_ID = "G-11E1T1HREX";
export const ANALYTICS_ORIGIN = "https://johnvexcoder.github.io";
export const ANALYTICS_CONSENT_STORAGE_KEY = "j0hnvexcoder-analytics-consent";
export const ANALYTICS_SCRIPT_ID = "portfolio-ga4";
export const ANALYTICS_COOKIE_PREFIX = "j0portfolio";
/** @type {Record<string, string>} */
export const analyticsPages = {
  "/": "J0hnvexcoder portfolio",
  "/services/": "Services and Solutions | J0hnvexcoder",
  ...Object.fromEntries(
    services.map((service) => [service.route, service.title]),
  ),
  "/404/": "Page not found | J0hnvexcoder",
  ...Object.fromEntries(
    projects.map((p) => [`/work/${p.id}/`, `${p.name} | J0hnvexcoder`]),
  ),
};
export const projectIds = new Set(projects.map((p) => p.id));
