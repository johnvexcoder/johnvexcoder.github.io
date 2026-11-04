import { prepareForm } from "./form-submission.ts";
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
export function prepareContact(
  data: FormData,
  accessKey: string,
  token: string,
) {
  const payload = prepareForm(data, accessKey, token, "contact");
  const subject = String(data.get("subject") || "").trim();
  payload.set(
    "subject",
    subject
      ? `New Contact Inquiry — ${subject}`
      : "New Project Inquiry — J0hnvexcoder Portfolio",
  );
  if (subject) payload.set("inquiry_subject", subject);
  const ids = data
    .getAll("services")
    .map(String)
    .filter((id) => selectedInquiryService(id));
  if (ids.length) {
    payload.set(
      "services",
      ids
        .map((id) => inquiryServices.find((s) => s.id === id)!.name)
        .join(", "),
    );
    payload.set("service_ids", ids.join(", "));
  }
  payload.delete("_gotcha");
  return payload;
}
