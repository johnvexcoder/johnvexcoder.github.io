export const inquiryServices = [
  { id: "business-websites", name: "Business website" },
  { id: "website-redesign", name: "Website redesign" },
  { id: "technical-seo", name: "Technical SEO and Website Optimization" },
  { id: "website-performance", name: "Website performance optimization" },
  { id: "custom-solutions", name: "Custom application" },
  { id: "booking-systems", name: "Booking and Reservation Systems" },
  { id: "cms-solutions", name: "Custom CMS Development" },
  { id: "crm-development", name: "Custom CRM Development" },
  {
    id: "admin-dashboard-development",
    name: "Admin Dashboard & Internal Tools Development",
  },
  { id: "portfolio-websites", name: "Portfolio website" },
  { id: "website-care", name: "Website care and maintenance" },
  { id: "other", name: "Other inquiry" },
];
export const inquiryTimelines = [
  "Exploring options",
  "Within a month",
  "1–3 months",
  "3–6 months",
  "Flexible — discuss with me",
];
export const selectedInquiryService = (value: string | null) =>
  inquiryServices.some((s) => s.id === value) ? value : null;
export const changePrimaryService = (current: string[], value: string) =>
  selectedInquiryService(value)
    ? [value, ...current.slice(1).filter((id) => id !== value)]
    : current;
export const addInquiryService = (current: string[], value: string) =>
  selectedInquiryService(value) && !current.includes(value)
    ? [...current, value]
    : current;
export type ContactSource = "homepage" | "contact_page";
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/myeenkka";
export function validateContact(data: FormData, source: ContactSource) {
  const errors: Record<string, string> = {};
  const get = (key: string) => String(data.get(key) || "").trim();
  if (!get("name") || get("name").length > 100)
    errors.name = "Enter your name (up to 100 characters).";
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get("email")) ||
    get("email").length > 254
  )
    errors.email = "Enter a valid email address.";
  if (source === "homepage" && (!get("subject") || get("subject").length > 160))
    errors.subject = "Enter a subject (up to 160 characters).";
  if (!get("message") || get("message").length > 10000)
    errors.message = "Describe your project (up to 10,000 characters).";
  if (source === "contact_page") {
    if (
      !data.getAll("services").some((id) => selectedInquiryService(String(id)))
    )
      errors.services = "Choose at least one project type.";
    if (get("website"))
      try {
        const url = new URL(get("website"));
        if (
          !["https:", "http:"].includes(url.protocol) ||
          url.username ||
          url.password
        )
          throw Error();
      } catch {
        errors.website = "Use a complete address such as https://example.com.";
      }
  }
  if (get("_gotcha"))
    errors.form = "Please leave the extra verification field empty.";
  return errors;
}
export type ContactResult =
  | { kind: "success" }
  | { kind: "verification"; message: string }
  | { kind: "error"; message: string; fields?: Record<string, string> };
/** Only explicit provider acceptance can produce success. Never retry an uncertain send automatically. */
export async function submitContact(
  data: FormData,
  request: typeof fetch = fetch,
): Promise<ContactResult> {
  const response = await request(FORMSPREE_ENDPOINT, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(25000),
  });
  const type = response.headers.get("content-type") || "";
  if (!type.includes("json"))
    return {
      kind: "verification",
      message:
        "Continue to the secure verification page to finish sending your message.",
    };
  const body: unknown = await response.json();
  const record =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  if (response.ok && record.ok === true) return { kind: "success" };
  const rows = Array.isArray(record.errors) ? record.errors : [];
  const messages = rows.map((e) =>
    e && typeof e === "object"
      ? String((e as Record<string, unknown>).message || "")
      : "",
  );
  const summary = [record.error, ...messages]
    .filter((v) => typeof v === "string")
    .join(" ");
  if (/captcha|verification|challenge/i.test(summary))
    return {
      kind: "verification",
      message:
        "Formspree needs a spam check before it can accept your message. Continue securely to complete it.",
    };
  if (response.status === 429)
    return {
      kind: "error",
      message:
        "The form is temporarily at its sending limit. Please try later or contact me by email.",
    };
  const fields: Record<string, string> = {};
  for (const row of rows) {
    if (row && typeof row === "object") {
      const e = row as Record<string, unknown>;
      if (
        typeof e.field === "string" &&
        ["name", "email", "subject", "message", "website", "services"].includes(
          e.field,
        )
      )
        fields[e.field] =
          typeof e.message === "string"
            ? e.message.slice(0, 200)
            : "Please check this field.";
    }
  }
  return {
    kind: "error",
    message:
      response.status >= 500
        ? "The message service is temporarily unavailable. Your entries are still here; please try later or use email."
        : "Your message was not accepted. Check the highlighted fields or contact me by email.",
    fields,
  };
}
