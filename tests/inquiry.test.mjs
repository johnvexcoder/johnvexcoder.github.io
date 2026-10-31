import test from "node:test";
import assert from "node:assert/strict";
import {
  validateContact,
  submitContact,
  selectedInquiryService,
  changePrimaryService,
  addInquiryService,
  FORMSPREE_ENDPOINT,
} from "../lib/inquiry.ts";
import { safeEvent } from "../lib/analytics.ts";
const data = (values = {}) => {
  const d = new FormData();
  for (const [k, v] of Object.entries({
    name: "Ana María",
    email: "ana@example.test",
    subject: "Website inquiry",
    message: "A café website & booking project.\n日本語 🏠",
    ...values,
  }))
    d.set(k, v);
  return d;
};
test("compact form validates required fields and preserves international message text", () => {
  const d = data();
  assert.deepEqual(validateContact(d, "homepage"), {});
  assert.ok(
    validateContact(
      data({ email: "bad", subject: "", message: "" }),
      "homepage",
    ).email,
  );
  assert.equal(
    d.get("message"),
    "A café website & booking project.\n日本語 🏠",
  );
});
test("detailed form accepts optional international planning fields and rejects unsafe website values", () => {
  const d = data({
    services: "website-redesign",
    website: "https://example.test/path?q=a&b=2",
    currency: "USD",
    budget: "To discuss",
  });
  d.delete("subject");
  assert.deepEqual(validateContact(d, "contact_page"), {});
  d.set("website", "javascript:alert(1)");
  assert.ok(validateContact(d, "contact_page").website);
  d.delete("services");
  assert.ok(validateContact(d, "contact_page").services);
  assert.ok(validateContact(data({ _gotcha: "bot" }), "homepage").form);
});
test("only an explicit successful provider acceptance produces success; uncertain responses cannot", async () => {
  let calls = 0;
  const d = data({ form_source: "homepage" });
  const good = await submitContact(d, async (url, options) => {
    calls++;
    assert.equal(url, FORMSPREE_ENDPOINT);
    assert.equal(options.method, "POST");
    assert.equal(options.body, d);
    assert.equal(options.headers.Accept, "application/json");
    return Response.json({ ok: true, next: "/thanks" }, { status: 200 });
  });
  assert.equal(calls, 1);
  assert.equal(good.kind, "success");
  assert.equal(
    (
      await submitContact(d, async () =>
        Response.json({ ok: false }, { status: 200 }),
      )
    ).kind,
    "error",
  );
  assert.equal(
    (
      await submitContact(d, async () =>
        Response.json(
          { errors: [{ field: "email", message: "Invalid email" }] },
          { status: 400 },
        ),
      )
    ).kind,
    "error",
  );
});
test("hosted CAPTCHA challenge is distinct from success, quota and network failures", async () => {
  const d = data();
  assert.equal(
    (
      await submitContact(d, async () =>
        Response.json({ error: "Please complete reCAPTCHA" }, { status: 400 }),
      )
    ).kind,
    "verification",
  );
  assert.equal(
    (
      await submitContact(
        d,
        async () =>
          new Response("<html>Verify</html>", {
            headers: { "Content-Type": "text/html" },
          }),
      )
    ).kind,
    "verification",
  );
  const quota = await submitContact(d, async () =>
    Response.json({ error: "Too many requests" }, { status: 429 }),
  );
  assert.equal(quota.kind, "error");
  assert.match(quota.message, /limit/);
  await assert.rejects(() =>
    submitContact(d, async () => {
      throw new TypeError("Network failure");
    }),
  );
});
test("analytics allows only fixed form context and strips inquiry personal information", () => {
  assert.deepEqual(
    safeEvent("contact_submission_success", {
      form_source: "contact_page",
      name: "Ana",
      email: "ana@example.test",
      message: "private",
    }),
    { form_source: "contact_page" },
  );
  assert.deepEqual(
    safeEvent("contact_submission_success", { form_source: "visitor text" }),
    {},
  );
  assert.equal(safeEvent("generate_lead", { name: "Ana" }), null);
});
test("service selection retains additional choices, distinguishes redesign, and rejects arbitrary query text", () => {
  const initial = ["business-websites", "technical-seo"];
  assert.equal(
    selectedInquiryService("website-performance"),
    "website-performance",
  );
  assert.equal(selectedInquiryService("visitor@example.test"), null);
  assert.deepEqual(changePrimaryService(initial, "website-redesign"), [
    "website-redesign",
    "technical-seo",
  ]);
  assert.deepEqual(addInquiryService(initial, "technical-seo"), initial);
  assert.deepEqual(initial, ["business-websites", "technical-seo"]);
});
