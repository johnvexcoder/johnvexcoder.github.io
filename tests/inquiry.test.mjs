import test from "node:test";
import assert from "node:assert/strict";
import {
  prepareInquiry,
  validateInquiry,
  selectedInquiryService,
  inquiryServices,
} from "../lib/inquiry.ts";
import { safeEvent } from "../lib/analytics.ts";
const base = {
  name: "Ana María & Co",
  email: "ana@example.test",
  company: "",
  website: "",
  services: ["business-websites", "technical-seo"],
  timeline: "1–3 months",
  description:
    "A café website & booking request.\nKeep # signs, + and 50% text intact.",
};
test("multi-service inquiry round-trips special characters, line breaks and empty optional fields", () => {
  const draft = prepareInquiry(base, "johnangelodejoya@gmail.com");
  const url = new URL(draft.mailto);
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.searchParams.get("body"), draft.body);
  assert.equal(url.searchParams.get("subject"), draft.subject);
  assert.ok(
    draft.body.includes(base.name) && draft.body.includes(base.description),
  );
  assert.ok(
    !draft.body.includes("Company:") &&
      !draft.body.includes("Existing website:"),
  );
  for (const service of inquiryServices.filter((s) =>
    base.services.includes(s.id),
  ))
    assert.ok(draft.body.includes(service.name));
  assert.equal(draft.tooLong, false);
  assert.deepEqual(validateInquiry(base), {});
});
test("optional company and website are included only when supplied, untrusted service values cannot preselect", () => {
  const data = {
    ...base,
    company: "Example & Sons",
    website: "https://example.test/path?q=a&b=2",
  };
  assert.deepEqual(validateInquiry(data), {});
  assert.match(prepareInquiry(data, "a@b.test").body, /Example & Sons/);
  assert.equal(selectedInquiryService("technical-seo"), "technical-seo");
  assert.equal(selectedInquiryService("visitor@example.test"), null);
  assert.ok(
    validateInquiry({ ...base, website: "javascript:alert(1)" }).website,
  );
  assert.ok(
    validateInquiry({
      ...base,
      name: " ",
      email: "bad",
      services: [],
      description: " ",
    }).name,
  );
});
test("long Unicode drafts select the complete copy fallback without truncating the inquiry", () => {
  const message = "日本語のウェブサイト 🏠 ".repeat(100);
  const draft = prepareInquiry({ ...base, description: message }, "a@b.test");
  assert.equal(draft.tooLong, true);
  assert.ok(draft.copyText.includes(message.trim()));
});
test("the existing contact key event accepts only fixed context, never inquiry personal details", () => {
  assert.deepEqual(
    safeEvent("contact_email_click", {
      location: "contact",
      name: base.name,
      email: base.email,
      message: base.description,
      website: "https://example.test",
    }),
    { location: "contact" },
  );
  assert.equal(safeEvent("generate_lead", { name: base.name }), null);
});

test("compact selection distinguishes redesign, prevents duplicates and preserves additional choices", async () => {
  const { changePrimaryService, addInquiryService } = await import(
    "../lib/inquiry.ts"
  );
  assert.equal(inquiryServices.length, 9);
  assert.equal(selectedInquiryService("website-redesign"), "website-redesign");
  assert.equal(selectedInquiryService("other"), "other");
  const initial = ["business-websites", "technical-seo"];
  assert.deepEqual(addInquiryService(initial, "technical-seo"), initial);
  assert.deepEqual(changePrimaryService(initial, "website-redesign"), [
    "website-redesign",
    "technical-seo",
  ]);
  assert.deepEqual(changePrimaryService(initial, "technical-seo"), [
    "technical-seo",
  ]);
  assert.deepEqual(initial, ["business-websites", "technical-seo"]);
  const prepared = prepareInquiry(
    { ...base, services: ["website-redesign", "technical-seo"] },
    "a@b.test",
  );
  assert.match(prepared.subject, /Website Redesign/);
  assert.match(prepared.body, /Technical SEO and Website Optimization/);
});
