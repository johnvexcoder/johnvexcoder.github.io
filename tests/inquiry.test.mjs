import test from "node:test";
import assert from "node:assert/strict";
import {
  validateContact,
  prepareContact,
  selectedInquiryService,
  changePrimaryService,
  addInquiryService,
} from "../lib/inquiry.ts";
import {
  submitWeb3Form,
  prepareForm,
  WEB3FORMS_ENDPOINT,
} from "../lib/form-submission.ts";
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
test("contact payload preserves every field and all selected services, with independent workflow subjects", () => {
  const d = data({
    form_source: "contact_page",
    company: "Café",
    budget: "1000–2000",
    currency: "PHP",
    timeline: "Flexible",
    additional_requirements: "日本語",
    website: "https://example.test",
  });
  d.append("services", "technical-seo");
  d.append("services", "website-redesign");
  const p = prepareContact(d, "public-test-key", "mock-token-local-only");
  assert.equal(p.get("access_key"), "public-test-key");
  assert.equal(p.get("replyto"), "ana@example.test");
  assert.equal(p.get("workflow"), "contact");
  assert.equal(p.get("subject"), "New Contact Inquiry — Website inquiry");
  assert.equal(p.get("inquiry_subject"), "Website inquiry");
  assert.equal(
    p.get("services"),
    "Technical SEO and Website Optimization, Website redesign",
  );
  assert.equal(p.get("service_ids"), "technical-seo, website-redesign");
  for (const k of [
    "name",
    "email",
    "message",
    "company",
    "budget",
    "currency",
    "timeline",
    "additional_requirements",
    "website",
    "form_source",
  ])
    assert.equal(p.get(k), d.get(k));
  assert.deepEqual(d.getAll("services"), ["technical-seo", "website-redesign"]);
  d.delete("subject");
  assert.match(
    prepareContact(d, "key", "token").get("subject"),
    /^New Project Inquiry/,
  );
  const review = prepareForm(
    data({
      rating: "5 out of 5 stars",
      permission_to_publish: "Yes — permission granted",
    }),
    "key",
    "token",
    "review",
  );
  assert.equal(review.get("workflow"), "review");
  assert.equal(review.get("rating"), "5 out of 5 stars");
  assert.equal(review.get("permission_to_publish"), "Yes — permission granted");
});
test("Web3Forms success needs HTTP success and the boolean success flag; no automatic retries", async () => {
  const d = prepareContact(data(), "key", "mock-token-local-only");
  let calls = 0;
  assert.equal(
    (
      await submitWeb3Form(d, async (url, options) => {
        calls++;
        assert.equal(url, WEB3FORMS_ENDPOINT);
        assert.equal(options.method, "POST");
        assert.equal(options.body, d);
        assert.equal(options.headers.Accept, "application/json");
        assert.equal(options.redirect, "error");
        assert.ok(options.signal);
        return Response.json({
          success: true,
          body: { message: "Email sent successfully!" },
        });
      })
    ).kind,
    "success",
  );
  assert.equal(calls, 1);
  for (const value of [false, "true", 1, undefined])
    assert.equal(
      (await submitWeb3Form(d, async () => Response.json({ success: value })))
        .kind,
      "error",
    );
  assert.equal(
    (
      await submitWeb3Form(d, async () =>
        Response.json({ success: true }, { status: 400 }),
      )
    ).kind,
    "error",
  );
});
test("missing tokens and honeypots do not send; failures stay errors with useful retry guidance", async () => {
  let calls = 0;
  const noSend = async () => {
    calls++;
    throw Error("must not send");
  };
  assert.equal((await submitWeb3Form(data(), noSend)).kind, "error");
  assert.equal(
    (
      await submitWeb3Form(
        data({ "h-captcha-response": "mock-token", botcheck: "on" }),
        noSend,
      )
    ).kind,
    "error",
  );
  assert.equal(calls, 0);
  const d = prepareContact(data(), "key", "mock-token-local-only");
  const cases = [
    [
      () =>
        Response.json(
          { success: false, message: "hCaptcha failed" },
          { status: 400 },
        ),
      /fresh verification/,
    ],
    [
      () =>
        Response.json(
          { success: false, body: { message: "captcha expired" } },
          { status: 400 },
        ),
      /fresh verification/,
    ],
    [() => Response.json({ success: false }, { status: 429 }), /limit/],
    [() => Response.json({ statusCode: 500 }, { status: 500 }), /unavailable/],
    [
      () =>
        new Response("<html>Error</html>", {
          headers: { "Content-Type": "text/html" },
        }),
      /unexpected response/,
    ],
    [
      () =>
        new Response("{broken", {
          headers: { "Content-Type": "application/json" },
        }),
      /couldn’t confirm/,
    ],
    [
      () => {
        throw new TypeError("Network failure");
      },
      /couldn’t confirm/,
    ],
    [
      () => {
        throw new DOMException("Expired", "TimeoutError");
      },
      /couldn’t confirm/,
    ],
  ];
  for (const [reply, pattern] of cases) {
    const r = await submitWeb3Form(d, async () => reply());
    assert.equal(r.kind, "error");
    assert.match(r.message, pattern);
    assert.equal(d.get("name"), "Ana María");
  }
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
