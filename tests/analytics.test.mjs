import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  createAnalyticsController,
  analyticsPage,
  safeEvent,
  safeReferrer,
} from "../lib/analytics.ts";
import {
  GA_MEASUREMENT_ID,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_SCRIPT_ID,
} from "../lib/analytics-config.mjs";
function harness({
  stored = null,
  blocked = false,
  origin = "https://johnvexcoder.github.io",
  production = true,
} = {}) {
  const storage = new Map(
    stored ? [[ANALYTICS_CONSENT_STORAGE_KEY, stored]] : [],
  );
  const scripts = new Map(),
    cookies = new Map([
      ["_ga", "old"],
      ["_ga_11E1T1HREX", "old"],
      ["j0portfolio_ga", "old"],
      ["j0portfolio_ga_TEST", "old"],
      ["_ga_OTHERPROPERTY", "keep"],
      ["theme", "dark"],
    ]);
  const events = new Map();
  let appended = 0,
    reloads = 0;
  const document = {
    referrer:
      "https://referrer.example/private/person?email=private@example.com#private",
    get cookie() {
      return [...cookies].map(([k, v]) => `${k}=${v}`).join("; ");
    },
    set cookie(value) {
      const name = value.split("=")[0];
      if (value.includes("Max-Age=0")) cookies.delete(name);
    },
    getElementById: (id) => scripts.get(id),
    createElement: () => ({
      remove() {
        scripts.delete(this.id);
      },
    }),
    head: {
      appendChild(script) {
        appended++;
        scripts.set(script.id, script);
      },
    },
  };
  const w = {
    document,
    location: {
      origin,
      hostname: new URL(origin).hostname,
      pathname: "/work/archeon/",
      reload() {
        reloads++;
      },
    },
    localStorage: {
      getItem(k) {
        if (blocked) throw Error("blocked");
        return storage.get(k) ?? null;
      },
      setItem(k, v) {
        if (blocked) throw Error("blocked");
        storage.set(k, v);
      },
    },
    addEventListener: (name, listener) => events.set(name, listener),
    removeEventListener: (name) => events.delete(name),
  };
  const controller = createAnalyticsController({
    getWindow: () => w,
    production,
  });
  const calls = () => w.dataLayer ?? [];
  return {
    controller,
    w,
    cookies,
    storage,
    scripts,
    calls,
    events,
    appended: () => appended,
    reloads: () => reloads,
  };
}
test("unknown and declined visitors never load a tag, create a queue or send events", () => {
  for (const stored of [null, "denied", "invalid"]) {
    const h = harness({ stored });
    assert.equal(
      h.controller.snapshot(),
      stored === "denied" ? "denied" : null,
    );
    h.controller.track("project_demo", { project: "archeon" });
    assert.equal(h.controller.initialize("/"), false);
    assert.equal(h.appended(), 0);
    assert.equal(h.w.dataLayer, undefined);
    assert.equal(h.w.gtag, undefined);
  }
});
test("explicit acceptance initializes one async tag, one config and one initial page view", () => {
  const h = harness();
  h.controller.update("granted");
  assert.equal(h.storage.get(ANALYTICS_CONSENT_STORAGE_KEY), "granted");
  h.controller.initialize("/?email=private@example.com");
  h.controller.initialize("/#private");
  h.controller.initialize("/");
  assert.equal(h.appended(), 1);
  assert.equal(h.scripts.get(ANALYTICS_SCRIPT_ID).async, true);
  assert.equal(h.calls().filter((c) => c[0] === "config").length, 1);
  const config = h.calls().find((c) => c[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.cookie_domain, "none");
  assert.equal(h.calls().filter((c) => c[1] === "page_view").length, 1);
  assert.equal(h.calls()[0][2].analytics_storage, "granted");
  assert.equal(h.calls()[0][2].ad_storage, "denied");
  assert.ok(!JSON.stringify(h.calls()).includes("private@example.com"));
});
test("gtag queues Google's required Arguments objects, never plain command arrays", () => {
  const h = harness({ stored: "granted" });
  h.controller.initialize("/");
  h.controller.track("contact_email_click", { location: "contact" });
  assert.ok(h.calls().length > 0);
  for (const command of h.calls()) {
    assert.equal(Array.isArray(command), false);
    assert.equal(Object.prototype.toString.call(command), "[object Arguments]");
  }
});
test("a Google-command consumer can read configuration and dispatch the existing email event", () => {
  const h = harness({ stored: "granted" });
  h.controller.initialize("/");
  h.controller.initialize("/");
  h.controller.track("contact_email_click", { location: "contact" });
  let accepted = false, configured = false;
  const events = [];
  // Contract model, not a substitute for the real-tag browser network check.
  for (const command of h.calls()) {
    if (Object.prototype.toString.call(command) !== "[object Arguments]") continue;
    if (command[0] === "consent") accepted = command[2].analytics_storage === "granted";
    if (command[0] === "config") configured = accepted && command[1] === GA_MEASUREMENT_ID;
    if (command[0] === "event" && configured) events.push(command[1]);
  }
  assert.equal(configured, true);
  assert.deepEqual(events, ["page_view", "contact_email_click"]);
});
test("accepted and declined preferences survive refresh and old valid choices remain usable", () => {
  for (const stored of ["granted", "denied"]) {
    const h = harness({ stored });
    assert.equal(h.controller.snapshot(), stored);
    h.controller.initialize("/");
    assert.equal(h.appended(), stored === "granted" ? 1 : 0);
  }
});
test("client routes count once, query/hash changes are ignored, returning to a route counts again", () => {
  const h = harness({ stored: "granted" });
  for (const p of [
    "/",
    "/work/archeon/",
    "/work/archeon/?secret=hi",
    "/work/archeon/#email",
    "/",
  ])
    h.controller.initialize(p);
  assert.deepEqual(
    h
      .calls()
      .filter((c) => c[1] === "page_view")
      .map((c) => c[2].page_location),
    [
      "https://johnvexcoder.github.io/",
      "https://johnvexcoder.github.io/work/archeon/",
      "https://johnvexcoder.github.io/",
    ],
  );
});
test("withdrawing immediately disables tracking, clears only owned cookies, removes tag and reloads", () => {
  const h = harness({ stored: "granted" });
  h.controller.initialize("/");
  h.controller.track("project_demo", {
    project: "archeon",
    action: "Live site",
  });
  h.controller.update("denied");
  assert.equal(h.w[`ga-disable-${GA_MEASUREMENT_ID}`], true);
  assert.equal(h.reloads(), 1);
  assert.equal(h.scripts.size, 0);
  assert.equal(h.storage.get(ANALYTICS_CONSENT_STORAGE_KEY), "denied");
  assert.deepEqual([...h.cookies.keys()], ["_ga_OTHERPROPERTY", "theme"]);
  assert.equal(h.w.dataLayer.length, 0);
  h.controller.track("project_demo", { project: "archeon" });
  h.controller.initialize("/work/archeon/");
  assert.equal(h.calls().length, 0);
});
test("declining before initialization does not reload or create gtag", () => {
  const h = harness();
  h.controller.update("denied");
  assert.equal(h.reloads(), 0);
  assert.equal(h.w.gtag, undefined);
  assert.equal(h.controller.snapshot(), "denied");
});
test("a loaded-library stand-in and later navigation cannot collect after withdrawal", () => {
  const h = harness({ stored: "granted" });
  h.controller.initialize("/");
  const requests = [];
  // Replace the queue with a loaded-tag stand-in. This deliberately does not
  // download Google or send events to the real measurement property.
  h.w.gtag = (...args) => {
    if (!h.w[`ga-disable-${GA_MEASUREMENT_ID}`]) requests.push(args);
  };
  const staleLibraryCallback = h.w.gtag;
  h.controller.track("contact_email_click", { location: "contact" });
  assert.equal(requests.length, 1);
  h.controller.update("denied");
  h.controller.track("contact_email_click", { location: "contact" });
  h.controller.initialize("/work/archeon/");
  staleLibraryCallback("event", "user_engagement");
  assert.equal(requests.length, 1);
  assert.equal(h.reloads(), 1);
  assert.equal(h.cookies.has("theme"), true);
  assert.equal(h.cookies.has("j0portfolio_ga"), false);
});
test("storage errors preserve the choice for the current document without breaking browsing", () => {
  const h = harness({ blocked: true });
  assert.equal(h.controller.snapshot(), null);
  h.controller.update("granted");
  assert.equal(h.controller.snapshot(), "granted");
  h.controller.initialize("/");
  assert.equal(h.appended(), 1);
  h.controller.update("denied");
  assert.equal(h.controller.snapshot(), "denied");
  assert.equal(h.reloads(), 1);
});
test("cross-tab withdrawal and cleared storage stop an initialized tag", () => {
  for (const value of ["denied", null]) {
    const h = harness({ stored: "granted" });
    let notifications = 0;
    const unsub = h.controller.subscribe(() => notifications++);
    h.controller.initialize("/");
    if (value) h.storage.set(ANALYTICS_CONSENT_STORAGE_KEY, value);
    else h.storage.clear();
    h.events.get("storage")({
      key: value ? ANALYTICS_CONSENT_STORAGE_KEY : null,
    });
    assert.equal(h.controller.snapshot(), value);
    assert.equal(h.reloads(), 1);
    assert.equal(notifications, 1);
    unsub();
    assert.equal(h.events.size, 0);
  }
});
test("unknown events, unknown fields and arbitrary private values never enter the queue", () => {
  assert.equal(safeEvent("made_up", { email: "person@example.com" }), null);
  assert.deepEqual(
    safeEvent("project_demo", {
      project: "archeon",
      action: "Live site",
      location: "case-study",
      email: "a@b.com",
      phone: "123",
      message: "private",
    }),
    { project: "archeon", action: "Live site", location: "case-study" },
  );
  assert.deepEqual(
    safeEvent("review_submitted", { service: "visitor@example.com" }),
    {},
  );
  assert.deepEqual(
    safeEvent("contact_social_click", {
      network: "https://private.example/person",
      location: "secret",
    }),
    {},
  );
  const h = harness({ stored: "granted" });
  h.controller.initialize("/");
  h.controller.track("unknown", { message: "private" });
  h.controller.track("review_submitted", {
    service: "Web Development",
    message: "private",
  });
  assert.equal(h.calls().filter((c) => c[1] === "unknown").length, 0);
  assert.equal(h.calls().at(-1)[2].service, "Web Development");
  assert.ok(!JSON.stringify(h.calls()).includes("private"));
});
test("only catalog routes and fixed titles are reported, and referrer paths/queries are discarded", () => {
  assert.equal(
    analyticsPage("/work/archeon/?email=a@b.com#secret").page_location,
    "https://johnvexcoder.github.io/work/archeon/",
  );
  assert.equal(
    analyticsPage("/visitor/name@example.com").page_location,
    "https://johnvexcoder.github.io/404/",
  );
  assert.equal(
    safeReferrer("https://example.com/private?secret=value"),
    "https://example.com",
  );
  assert.equal(safeReferrer("javascript:secret"), "");
});
test("localhost, previews and development never send production test traffic", () => {
  for (const options of [
    { origin: "http://127.0.0.1:3005" },
    { origin: "https://preview.example.com" },
    { production: false },
  ]) {
    const h = harness({ ...options, stored: "granted" });
    h.controller.initialize("/");
    h.controller.track("resume_download");
    assert.equal(h.appended(), 0);
    assert.equal(h.w.dataLayer, undefined);
  }
});
test("server execution is safe", () => {
  const c = createAnalyticsController({ getWindow: () => undefined });
  assert.equal(c.snapshot(), null);
  assert.equal(c.initialize("/"), false);
  assert.doesNotThrow(() => c.track("resume_download"));
});
test("the existing email key event retains its exact name and is queued once per click", () => {
  const h = harness({ stored: "granted" });
  h.controller.initialize("/");
  h.controller.track("contact_email_click", { location: "contact" });
  const events = h.calls().filter((c) => c[0] === "event");
  assert.equal(events.filter((c) => c[1] === "contact_email_click").length, 1);
  assert.equal(events.filter((c) => c[1] === "contact_form_submit").length, 0);
  assert.deepEqual(events.at(-1)[2], {
    location: "contact",
    send_to: GA_MEASUREMENT_ID,
  });
  const contact = fs.readFileSync("components/Contact.tsx", "utf8");
  assert.equal((contact.match(/data-ga-event="contact_email_click"/g) || []).length, 1);
});
test("contact email preparation is not claimed as successful delivery; review success is verified", () => {
  const contact = fs.readFileSync("components/Contact.tsx", "utf8"),
    review = fs.readFileSync("components/ReviewForm.tsx", "utf8");
  assert.ok(contact.includes("contact_email_prepare"));
  assert.ok(!contact.includes("contact_form_submit"));
  assert.ok(
    review.indexOf('track("review_submitted"') >
      review.indexOf("if (!response.ok || !result.success)"),
  );
});
