"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Copy, Check, Plus, X } from "lucide-react";
import { contacts, profile } from "@/lib/content";
import { track } from "@/lib/analytics";
import {
  inquiryServices,
  changePrimaryService,
  addInquiryService,
  inquiryTimelines,
  selectedInquiryService,
  prepareInquiry,
  validateInquiry,
  type Inquiry,
} from "@/lib/inquiry";
import Reveal from "./Reveal";
export default function Contact() {
  const [selected, setSelected] = useState<string[]>([]);
  const [addingService, setAddingService] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [manual, setManual] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const select = (value: string | null) => {
      const id = selectedInquiryService(value);
      if (id) setSelected((current) => changePrimaryService(current, id));
    };
    select(new URLSearchParams(window.location.search).get("service"));
    const listener = (event: Event) =>
      select((event as CustomEvent<string>).detail);
    window.addEventListener("portfolio-enquiry", listener);
    return () => window.removeEventListener("portfolio-enquiry", listener);
  }, []);
  const draft = () => {
    const form = formRef.current!;
    const values = new FormData(form);
    const data: Inquiry = {
      name: String(values.get("name") || ""),
      email: String(values.get("email") || ""),
      company: String(values.get("company") || ""),
      website: String(values.get("website") || ""),
      services: selected,
      timeline: String(values.get("timeline") || ""),
      description: String(values.get("description") || ""),
    };
    const problems = validateInquiry(data);
    setErrors(problems);
    if (Object.keys(problems).length) {
      setStatus("Please check the highlighted fields.");
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(problems)[0]}"]`)
        ?.focus();
      return null;
    }
    return prepareInquiry(data, profile.email);
  };
  const fieldError = (name: string) =>
    errors[name] ? (
      <small id={`inquiry-${name}-error`} className="inquiry-error">
        {errors[name]}
      </small>
    ) : null;
  return (
    <section id="contact" className="section contact-section">
      <Reveal className="contact-copy">
        <p className="eyebrow">11 / LET’S CONNECT</p>
        <h2>
          Have something
          <br />
          <span>in mind?</span>
        </h2>
        <p>
          A website idea. A software project. An infrastructure challenge. Let’s
          talk about what you’re building.
        </p>
        <a
          className="contact-email"
          href={`mailto:${profile.email}`}
          data-ga-event="contact_email_click"
          data-ga-location="contact"
        >
          {profile.email}
          <ArrowUpRight size={23} />
        </a>
        <div className="contact-socials">
          {contacts.slice(1).map(([name, url, text]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}: ${text}`}
              data-ga-event="contact_social_click"
              data-ga-network={name}
              data-ga-location="contact"
            >
              {name}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </div>
        <a
          className="text-link"
          href="/resume.pdf"
          download
          data-ga-event="resume_download"
          data-ga-location="contact"
        >
          Download résumé <ArrowUpRight size={14} />
        </a>
        <p className="contact-note">
          Based in the Philippines · UTC+8
          <br />
          Email is the easiest way to start.
        </p>
      </Reveal>
      <Reveal className="contact-form-wrap">
        <div className="inquiry-heading">
          <p className="eyebrow">PROJECT INQUIRY</p>
          <h3>A useful starting point.</h3>
          <p>
            I work directly with you. Tell me what you need; I’ll review the
            scope and feasibility with you.
          </p>
        </div>
        <form
          ref={formRef}
          noValidate
          onChange={() => setManual("")}
          onSubmit={(event) => {
            event.preventDefault();
            const message = draft();
            if (!message) return;
            if (message.tooLong) {
              setManual(message.copyText);
              setStatus(
                "This draft is too long for a reliable email-app link. Copy the inquiry below, then paste it into an email to John.",
              );
              return;
            }
            window.location.href = message.mailto;
            track("contact_email_prepare", { method: "email_app" });
            track("contact_email_click", { location: "contact" });
            setStatus(
              "Your device was asked to open its email app. Nothing has been sent. If no app opens, use Copy Inquiry.",
            );
          }}
        >
          <div className="form-row">
            <label htmlFor="inquiry-name">
              Full name
              <input
                id="inquiry-name"
                aria-label="Full name"
                name="name"
                autoComplete="name"
                required
                maxLength={100}
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? "inquiry-name-error" : undefined
                }
              />
              {fieldError("name")}
            </label>
            <label htmlFor="inquiry-email">
              Email
              <input
                id="inquiry-email"
                aria-label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "inquiry-email-error" : undefined
                }
              />
              {fieldError("email")}
            </label>
          </div>
          <div className="form-row">
            <label htmlFor="inquiry-company">
              Company <span className="field-optional">optional</span>
              <input
                id="inquiry-company"
                name="company"
                autoComplete="organization"
                maxLength={100}
              />
            </label>
            <label htmlFor="inquiry-website">
              Existing website <span className="field-optional">optional</span>
              <input
                id="inquiry-website"
                name="website"
                type="url"
                placeholder="https://example.com"
                maxLength={200}
                aria-invalid={!!errors.website}
                aria-describedby={
                  errors.website ? "inquiry-website-error" : undefined
                }
              />
              {fieldError("website")}
            </label>
          </div>
          <div className="inquiry-service-select">
            <label htmlFor="inquiry-service">
              What service do you need?
              <select
                id="inquiry-service"
                name="services"
                value={selected[0] || ""}
                required
                aria-invalid={!!errors.services}
                aria-describedby={
                  errors.services ? "inquiry-services-error" : undefined
                }
                onChange={(event) => {
                  setSelected((current) =>
                    changePrimaryService(current, event.target.value),
                  );
                  setManual("");
                }}
              >
                <option value="" disabled>
                  Select a service
                </option>
                {inquiryServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {fieldError("services")}
            </label>
            {selected.length > 1 && (
              <ul
                className="inquiry-service-chips"
                aria-label="Additional selected services"
              >
                {selected.slice(1).map((id) => {
                  const service = inquiryServices.find((s) => s.id === id)!;
                  return (
                    <li key={id}>
                      <span>{service.name}</span>
                      <button
                        type="button"
                        aria-label={`Remove ${service.name}`}
                        onClick={() => {
                          setSelected((current) =>
                            current.filter((value) => value !== id),
                          );
                          setManual("");
                        }}
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
            {addingService && (
              <label
                htmlFor="inquiry-additional-service"
                className="inquiry-additional-label"
              >
                Additional service
                <select
                  id="inquiry-additional-service"
                  value=""
                  onChange={(event) => {
                    setSelected((current) =>
                      addInquiryService(current, event.target.value),
                    );
                    setAddingService(false);
                    setManual("");
                    document.getElementById("inquiry-add-service")?.focus();
                  }}
                >
                  <option value="" disabled>
                    Select another service
                  </option>
                  {inquiryServices
                    .filter((service) => !selected.includes(service.id))
                    .map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                </select>
              </label>
            )}
            {selected.length < inquiryServices.length && (
              <button
                id="inquiry-add-service"
                className="inquiry-add-service"
                type="button"
                disabled={!selected.length}
                aria-expanded={addingService}
                aria-controls="inquiry-additional-service"
                onClick={() => setAddingService((value) => !value)}
              >
                <Plus size={13} aria-hidden="true" />
                {addingService
                  ? "Cancel additional service"
                  : "Add another service"}
              </button>
            )}
          </div>
          <label htmlFor="inquiry-timeline">
            Preferred project timeline
            <select
              id="inquiry-timeline"
              name="timeline"
              defaultValue="Flexible — discuss with me"
            >
              {inquiryTimelines.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label htmlFor="inquiry-description">
            Project description
            <textarea
              id="inquiry-description"
              aria-label="Project description"
              name="description"
              rows={4}
              required
              maxLength={1800}
              placeholder="What needs to work? Who is it for? Include any important requirements."
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description
                  ? "inquiry-description-help inquiry-description-error"
                  : "inquiry-description-help"
              }
            />
            <small id="inquiry-description-help">
              A short outline is enough. Please leave out passwords and
              sensitive information.
            </small>
            {fieldError("description")}
          </label>
          <div className="inquiry-actions">
            <button className="button primary" type="submit">
              Open Email App <ArrowUpRight size={16} />
            </button>
            <button
              className="button secondary"
              type="button"
              onClick={async () => {
                const message = draft();
                if (!message) return;
                try {
                  if (message.tooLong) setManual(message.copyText);
                  await navigator.clipboard.writeText(message.copyText);
                  setStatus(
                    "Inquiry copied. Paste it into your preferred email application; it has not been sent.",
                  );
                } catch {
                  setManual(message.copyText);
                  setStatus(
                    "Clipboard access is unavailable. Select and copy the prepared inquiry below.",
                  );
                }
              }}
            >
              <Copy size={15} />
              Copy Inquiry
            </button>
          </div>
          <p className="form-note">
            This prepares a message in your email app. You send it there.
            Inquiry details stay in this page while it is open; they are not
            saved by this website or sent to analytics. Copy Inquiry copies them
            to your device’s clipboard.
          </p>
          {manual && (
            <div className="inquiry-manual">
              <label htmlFor="inquiry-prepared">
                Prepared inquiry
                <textarea
                  id="inquiry-prepared"
                  readOnly
                  value={manual}
                  rows={9}
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>
              <p>Copy this text and paste it into your email app.</p>
              <a
                className="text-link"
                href={`mailto:${profile.email}`}
                data-ga-event="contact_email_click"
                data-ga-location="contact"
              >
                Open a blank email <ArrowUpRight size={14} />
              </a>
            </div>
          )}
          <button
            className="copy-email"
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(profile.email);
                setCopied(true);
                setStatus("Email address copied.");
                track("contact_copy_email", { location: "contact" });
              } catch {
                setStatus(`Please copy: ${profile.email}`);
              }
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}{" "}
            {copied ? "Email copied" : "Copy email address"}
          </button>
          <p className="form-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </Reveal>
    </section>
  );
}
