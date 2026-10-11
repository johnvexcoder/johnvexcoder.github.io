import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  GA_MEASUREMENT_ID,
  ANALYTICS_CONSENT_STORAGE_KEY,
  analyticsBootstrap,
  applyAnalyticsConsent,
  getAnalyticsConsentSnapshot,
  subscribeAnalyticsConsent,
  track,
  updateAnalyticsConsent,
} from "../lib/analytics.ts";

test("the confirmed GA4 measurement ID is configured once", () => {
  assert.equal(GA_MEASUREMENT_ID, "G-11E1T1HREX");
  const source = fs.readFileSync("components/GoogleAnalytics.tsx", "utf8");
  assert.equal(
    (source.match(/googletagmanager\.com\/gtag\/js/g) || []).length,
    1,
    "exactly one Google tag loader",
  );
  assert.ok(!/page_view/.test(source), "no manual page_view event");
  assert.ok(!/usePathname/.test(source), "no manual route page-view hook");
});

test("consent defaults to denied and never asks for advertising storage", () => {
  assert.match(analyticsBootstrap, /analytics_storage:'denied'/);
  assert.match(analyticsBootstrap, /ad_storage:'denied'/);
  assert.match(analyticsBootstrap, /ad_user_data:'denied'/);
  assert.match(analyticsBootstrap, /ad_personalization:'denied'/);
  assert.match(analyticsBootstrap, /wait_for_update/);
  assert.ok(!analyticsBootstrap.includes("analytics_storage:'granted'"));
});

test("custom events never include personal information", () => {
  const calls = [];
  globalThis.window = { gtag: (...args) => calls.push(args) };
  try {
    track("project_demo", {
      project: "archeon",
      action: "Live site",
      email: "visitor@example.com",
      name: "Visitor",
      message: "hello",
      subject: "enquiry",
    });
    assert.deepEqual(calls, [
      ["event", "project_demo", { project: "archeon", action: "Live site" }],
    ]);
    track("contact_form_submit", { method: "email_app" });
    assert.deepEqual(calls[1], [
      "event",
      "contact_form_submit",
      { method: "email_app" },
    ]);
  } finally {
    delete globalThis.window;
  }
});

test("consent choice is read from storage, applied to the tag and persisted", () => {
  const calls = [];
  const store = {};
  globalThis.window = {
    gtag: (...args) => calls.push(args),
    localStorage: {
      getItem: (key) => (key in store ? store[key] : null),
      setItem: (key, value) => {
        store[key] = value;
      },
    },
  };
  try {
    store[ANALYTICS_CONSENT_STORAGE_KEY] = "granted";
    assert.equal(getAnalyticsConsentSnapshot(), "granted");

    let notified = 0;
    const unsubscribe = subscribeAnalyticsConsent(() => notified++);
    updateAnalyticsConsent("denied");
    unsubscribe();

    assert.deepEqual(calls, [
      ["consent", "update", { analytics_storage: "denied" }],
    ]);
    assert.equal(getAnalyticsConsentSnapshot(), "denied");
    assert.equal(store[ANALYTICS_CONSENT_STORAGE_KEY], "denied");
    assert.equal(notified, 1);

    calls.length = 0;
    applyAnalyticsConsent("granted");
    assert.deepEqual(calls, [
      ["consent", "update", { analytics_storage: "granted" }],
    ]);
  } finally {
    delete globalThis.window;
  }
});

test("interaction tracking is wired for projects, contact and forms", () => {
  const samples = {
    "components/Projects.tsx": ["project_demo", "project_reference"],
    "app/work/[id]/page.tsx": ["project_demo", "project_reference"],
    "components/Contact.tsx": [
      "contact_email_click",
      "contact_social_click",
      "resume_download",
      "contact_form_submit",
      "contact_copy_email",
    ],
    "components/ReviewForm.tsx": ["review_submitted"],
    "components/ProfileSections.tsx": ["service_enquiry"],
  };
  for (const [file, events] of Object.entries(samples)) {
    const source = fs.readFileSync(file, "utf8");
    for (const event of events)
      assert.ok(source.includes(event), `${file}: ${event}`);
  }
});
