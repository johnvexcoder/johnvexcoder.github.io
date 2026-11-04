"use client";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, CheckCircle2 } from "lucide-react";
import {
  inquiryServices,
  inquiryTimelines,
  selectedInquiryService,
  validateContact,
  prepareContact,
  type ContactSource,
} from "@/lib/inquiry";
import { track } from "@/lib/analytics";
import { submitWeb3Form, WEB3FORMS_ENDPOINT } from "@/lib/form-submission";
import config from "@/content/review-config.json";
import FormCaptcha from "./FormCaptcha";
export default function InquiryForm({ source }: { source: ContactSource }) {
  const detailed = source === "contact_page";
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const inFlight = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const token = useRef("");
  const [captchaKey, setCaptchaKey] = useState(0);
  const [ready, setReady] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  useEffect(() => {
    if (formRef.current) formRef.current.noValidate = true;
    setReady(true);
    if (!detailed) return;
    const value = selectedInquiryService(
      new URLSearchParams(location.search).get("service"),
    );
    if (value) setServices([value]);
  }, [detailed]);
  const needsWebsite = services.some((value) =>
    [
      "website-redesign",
      "technical-seo",
      "website-performance",
      "website-care",
    ].includes(value),
  );
  const input = (
    name: string,
    label: string,
    required = false,
    type = "text",
    maxLength = 100,
  ) => (
    <div className="inquiry-field">
      <label htmlFor={`${id}-${name}`}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        type={type}
        required={required}
        spellCheck={type === "email" ? false : undefined}
        maxLength={maxLength}
        autoComplete={
          name === "name"
            ? "name"
            : name === "email"
              ? "email"
              : name === "company"
                ? "organization"
                : name === "website"
                  ? "url"
                  : "off"
        }
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${id}-${name}-error` : undefined}
      />
      {errors[name] && (
        <small className="inquiry-error" id={`${id}-${name}-error`}>
          {errors[name]}
        </small>
      )}
    </div>
  );
  const validate = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const next = validateContact(data, source);
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("Please check the highlighted fields.");
      const field = form.querySelector<HTMLElement>(
        `[name="${Object.keys(next)[0]}"]`,
      );
      const panel = field?.closest("details");
      if (panel) panel.open = true;
      field?.focus();
      return null;
    }
    return data;
  };
  return (
    <form
      ref={formRef}
      className={`inquiry-form ${detailed ? "inquiry-detailed" : "inquiry-compact"}`}
      action={WEB3FORMS_ENDPOINT}
      method="post"
      data-submission-transport="ajax"
      aria-busy={sending}
      onInput={(event) => {
        const field = event.target as HTMLInputElement;
        if (!field.name || !errors[field.name]) return;
        setErrors((current) => {
          const next = { ...current };
          delete next[field.name];
          return next;
        });
        setStatus("");
      }}
      onSubmit={async (event) => {
        event.preventDefault();
        if (inFlight.current) return;
        const form = event.currentTarget;
        const data = validate(form);
        if (!data) return;
        if (!token.current) {
          setStatus("Please complete the verification before sending.");
          form.querySelector<HTMLElement>(".captcha")?.focus();
          return;
        }
        inFlight.current = true;
        setSending(true);
        setStatus("Sending your message…");
        try {
          const payload = prepareContact(
            data,
            process.env.NEXT_PUBLIC_CONTACT_ACCESS_KEY ||
              process.env.NEXT_PUBLIC_REVIEW_ACCESS_KEY ||
              config.accessKey,
            token.current,
          );
          const result = await submitWeb3Form(payload);
          if (result.kind === "success") {
            setSent(true);
            setStatus(
              "Your message has been accepted. Thank you — I’ll reply by email.",
            );
            form.reset();
            setServices([]);
            track("contact_submission_success", { form_source: source });
          } else {
            setStatus(result.message);
          }
        } catch {
          setStatus(
            "We couldn’t confirm that your message was accepted. Your entries are still here. Check your connection, or email me before sending again.",
          );
        } finally {
          token.current = "";
          setCaptchaKey((key) => key + 1);
          inFlight.current = false;
          setSending(false);
        }
      }}
    >
      <input type="hidden" name="form_source" value={source} />
      <input
        className="honeypot"
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="inquiry-honeypot" aria-hidden="true">
        <label htmlFor={`${id}-website-check`}>Leave this field empty</label>
        <input
          id={`${id}-website-check`}
          name="_gotcha"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {sent ? (
        <div className="inquiry-success" role="status">
          <CheckCircle2 size={26} />
          <h2>Message accepted.</h2>
          <p>{status}</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              setSent(false);
              setStatus("");
            }}
          >
            Start another inquiry
          </button>
        </div>
      ) : (
        <>
          {detailed ? (
            <>
              <fieldset>
                <legend>Your details</legend>
                <div className="form-row">
                  {input("name", "Full name", true)}
                  {input("email", "Email", true, "email", 254)}
                </div>
              </fieldset>
              <fieldset
                aria-describedby={
                  errors.services ? `${id}-services-error` : undefined
                }
              >
                <legend>What are we building?</legend>
                <p className="inquiry-hint">
                  Select the services that fit. It’s fine if the scope is still
                  taking shape.
                </p>
                <div className="inquiry-service-grid">
                  {inquiryServices.map((service) => (
                    <label className="inquiry-service-option" key={service.id}>
                      <input
                        type="checkbox"
                        name="services"
                        value={service.id}
                        checked={services.includes(service.id)}
                        onChange={(e) =>
                          setServices((current) =>
                            e.target.checked
                              ? [...current, service.id]
                              : current.filter((id) => id !== service.id),
                          )
                        }
                      />
                      <span>{service.name}</span>
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="inquiry-error" id={`${id}-services-error`}>
                    {errors.services}
                  </p>
                )}
              </fieldset>
              <details
                className="inquiry-disclosure"
                open={needsWebsite || undefined}
              >
                <summary>
                  Company &amp; existing website <span>Optional</span>
                </summary>
                {needsWebsite && (
                  <p className="inquiry-hint">
                    For an existing site, a URL helps me review the current
                    experience before we discuss changes.
                  </p>
                )}
                <div className="form-row">
                  {input("company", "Company or organization")}
                  {input("website", "Existing website", false, "url", 2048)}
                </div>
              </details>
            </>
          ) : (
            <>
              <div className="form-row">
                {input("name", "Name", true)}
                {input("email", "Email", true, "email", 254)}
              </div>
              {input("subject", "Subject", true, "text", 160)}
            </>
          )}
          <div className="inquiry-field">
            <label htmlFor={`${id}-message`}>
              {detailed ? "Project description" : "Message"}{" "}
              <span aria-hidden="true">*</span>
            </label>
            <textarea
              id={`${id}-message`}
              name="message"
              required
              maxLength={10000}
              rows={detailed ? 4 : 3}
              aria-invalid={!!errors.message}
              aria-describedby={
                errors.message ? `${id}-message-error` : undefined
              }
              placeholder={
                detailed
                  ? "What should the project achieve? What already exists, and what needs to change?"
                  : "Tell me what you have in mind."
              }
            />
            {errors.message && (
              <small className="inquiry-error" id={`${id}-message-error`}>
                {errors.message}
              </small>
            )}
          </div>
          {detailed && (
            <details className="inquiry-disclosure planning-disclosure">
              <summary>
                Budget, timing &amp; extra context <span>Optional</span>
              </summary>
              <div className="form-row planning-row">
                {input("budget", "Budget range", false, "text", 100)}
                <div className="inquiry-field">
                  <label htmlFor={`${id}-currency`}>Currency</label>
                  <select id={`${id}-currency`} name="currency" defaultValue="">
                    <option value="">To discuss</option>
                    {["PHP", "USD", "AUD", "GBP", "SGD", "EUR", "Other"].map(
                      (c) => (
                        <option key={c}>{c}</option>
                      ),
                    )}
                  </select>
                </div>
                <div className="inquiry-field">
                  <label htmlFor={`${id}-timeline`}>Desired timeline</label>
                  <select id={`${id}-timeline`} name="timeline" defaultValue="">
                    <option value="">To discuss</option>
                    {inquiryTimelines.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="inquiry-field">
                <label htmlFor={`${id}-requirements`}>
                  Additional requirements
                </label>
                <textarea
                  id={`${id}-requirements`}
                  name="additional_requirements"
                  maxLength={4000}
                  rows={3}
                />
              </div>
              <p className="inquiry-hint">
                A starting point for discussion, not a price or commitment. Use
                any budget range and currency that suit your project.
              </p>
            </details>
          )}
          <FormCaptcha
            resetKey={captchaKey}
            onVerify={(value) => {
              token.current = value;
              setStatus("");
            }}
            onExpire={() => {
              token.current = "";
              setStatus(
                "Verification expired. Please complete it again before sending.",
              );
            }}
            onError={() => {
              token.current = "";
              setStatus(
                "Verification is unavailable. Retry verification, or contact me by email.",
              );
            }}
          />
          <p className="inquiry-privacy">
            Sent through Web3Forms with hCaptcha spam protection. Your details
            are used to reply to this inquiry. Leave out passwords and
            confidential information.
          </p>
          {status && (
            <p
              className={sending ? "inquiry-status" : "inquiry-error"}
              role={sending ? "status" : "alert"}
            >
              {status}
            </p>
          )}
          <div className="inquiry-submit">
            <button
              className="button primary"
              type="submit"
              disabled={sending || !ready}
            >
              {sending ? (
                <>
                  <LoaderCircle
                    className="inquiry-spinner"
                    size={16}
                    aria-hidden="true"
                  />
                  Sending…
                </>
              ) : (
                <>
                  Send message <ArrowUpRight size={16} />
                </>
              )}
            </button>
            {status && !sending && (
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  token.current = "";
                  setCaptchaKey((key) => key + 1);
                  setStatus("Complete a fresh verification, then send again.");
                }}
              >
                Retry verification
              </button>
            )}
          </div>
          <noscript>
            <p>
              Enable JavaScript to use this form, or email
              johnangelodejoya@gmail.com.
            </p>
          </noscript>
        </>
      )}
    </form>
  );
}
