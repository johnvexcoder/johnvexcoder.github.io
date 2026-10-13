export const inquiryServices = [
  { id: "business-websites", name: "Business Website Development" },
  { id: "website-redesign", name: "Website Redesign" },
  { id: "technical-seo", name: "Technical SEO and Website Optimization" },
  { id: "cms-solutions", name: "Custom CMS Development" },
  { id: "portfolio-websites", name: "Professional Portfolio Website" },
  { id: "booking-systems", name: "Booking and Reservation Systems" },
  { id: "custom-solutions", name: "Custom Web Applications and Solutions" },
  { id: "website-care", name: "Website Care and Maintenance" },
  { id: "other", name: "Other / Not sure yet" },
];
export function changePrimaryService(current: string[], value: string) {
  return selectedInquiryService(value)
    ? [value, ...current.slice(1).filter((id) => id !== value)]
    : current;
}
export function addInquiryService(current: string[], value: string) {
  return selectedInquiryService(value) && !current.includes(value)
    ? [...current, value]
    : current;
}
export const inquiryTimelines = [
  "Exploring options",
  "Within a month",
  "1–3 months",
  "3–6 months",
  "Flexible — discuss with me",
];
export type Inquiry = {
  name: string;
  email: string;
  company: string;
  website: string;
  services: string[];
  timeline: string;
  description: string;
};
const cleanLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();
export function selectedInquiryService(value: string | null) {
  return inquiryServices.some((service) => service.id === value) ? value : null;
}
export function validateInquiry(data: Inquiry) {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  if (!data.services.some((id) => selectedInquiryService(id)))
    errors.services = "Choose at least one service.";
  if (!data.description.trim())
    errors.description = "Please describe your project.";
  if (data.website.trim()) {
    try {
      const url = new URL(data.website.trim());
      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        throw Error();
    } catch {
      errors.website =
        "Use a complete website address, such as https://example.com.";
    }
  }
  return errors;
}
export function prepareInquiry(data: Inquiry, recipient: string) {
  const selected = inquiryServices.filter((service) =>
    data.services.includes(service.id),
  );
  const subject = `Project inquiry — ${selected.map((service) => service.name).join(" + ")}`;
  const body = [
    "Hello John,",
    "",
    `Name: ${cleanLine(data.name)}`,
    `Email: ${cleanLine(data.email)}`,
    ...(data.company.trim() ? [`Company: ${cleanLine(data.company)}`] : []),
    ...(data.website.trim()
      ? [`Existing website: ${cleanLine(data.website)}`]
      : []),
    `Services: ${selected.map((s) => s.name).join("; ")}`,
    `Preferred timeline: ${inquiryTimelines.includes(data.timeline) ? data.timeline : "To discuss"}`,
    "",
    "Project:",
    data.description.trim(),
  ].join("\n");
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body.toWellFormed())}`;
  return {
    subject,
    body,
    mailto,
    copyText: `To: ${recipient}\nSubject: ${subject}\n\n${body}`,
    tooLong: mailto.length > 1800,
  };
}
