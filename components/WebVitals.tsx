"use client";
import { useEffect } from "react";
import { onCLS, onLCP, onINP, onFCP, onTTFB, type Metric } from "web-vitals";

// Opt-in local diagnostics. Never send metrics to an analytics service.
let registered = false;
const report = (metric: Metric) => {
  console.info(
    "[portfolio-vitals]",
    JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
    }),
  );
};
export default function WebVitals() {
  useEffect(() => {
    // These observers belong to the document, not a section. Register once even
    // under StrictMode; web-vitals owns their page-lifecycle finalization.
    if (registered) return;
    registered = true;
    const options = { reportAllChanges: true };
    onCLS(report, options);
    onLCP(report, options);
    onINP(report, options);
    onFCP(report);
    onTTFB(report);
  }, []);
  return null;
}
