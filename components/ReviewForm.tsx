"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import config from "@/content/review-config.json";
import { track } from "@/lib/analytics";
import ReviewDialog from "./ReviewDialog";
import FormCaptcha from "./FormCaptcha";
import { prepareForm, submitWeb3Form } from "@/lib/form-submission";
export default function ReviewForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false),
    [count, setCount] = useState(0);
  const [captchaKey, setCaptchaKey] = useState(0);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const token = useRef("");
  const inFlight = useRef(false);
  useEffect(() => {
    token.current = "";
    setStatus("");
  }, [open]);
  return (
    <ReviewDialog open={open} onClose={onClose} challengeOpen={challengeOpen}>
      {sent ? (
        <div className="review-success" role="status">
          <Check size={32} />
          <h3>Thank you for your feedback.</h3>
          <p>
            Your review was accepted for approval. It will be published only
            after review.
          </p>
          <button className="button primary" onClick={onClose}>
            Close
          </button>
        </div>
      ) : (
        <form
          className="review-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (inFlight.current) return;
            if (!token.current) {
              setStatus("Please complete the verification before submitting.");
              return;
            }
            const form = e.currentTarget;
            inFlight.current = true;
            setBusy(true);
            setStatus("Sending your review…");
            const data = prepareForm(
              new FormData(form),
              process.env.NEXT_PUBLIC_REVIEW_ACCESS_KEY || config.accessKey,
              token.current,
              "review",
            );
            data.set("subject", "New Client Review — J0hnvexcoder Portfolio");
            try {
              const result = await submitWeb3Form(data);
              if (result.kind !== "success") {
                setStatus(result.message);
                return;
              }
              form.reset();
              setCount(0);
              track("review_submitted", {
                service: String(data.get("project_service") || ""),
              });
              setSent(true);
            } catch (error) {
              setStatus(
                error instanceof Error
                  ? error.message
                  : "Unable to send. Please check your connection.",
              );
            } finally {
              token.current = "";
              setCaptchaKey((k) => k + 1);
              setChallengeOpen(false);
              inFlight.current = false;
              setBusy(false);
            }
          }}
        >
          <p>Worked with me? I’d appreciate hearing about your experience.</p>
          <div className="form-row">
            <label>
              Name
              <input name="name" autoComplete="name" maxLength={60} required />
            </label>
            <label>
              Email <small>Private · never published</small>
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </label>
          </div>
          <label>
            Company / profession
            <input name="company_profession" maxLength={80} />
          </label>
          <label>
            Project / service
            <select name="project_service" required>
              <option value="">Choose a service</option>
              {[
                "Portfolio Website",
                "Business Website",
                "Web Development",
                "WordPress",
                "E-Commerce",
                "Website Maintenance",
                "UI / Web Design",
                "Infrastructure / Deployment",
                "Technical Support",
                "Other",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <fieldset className="rating-field">
            <legend>Rating</legend>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n}>
                <input
                  type="radio"
                  name="rating"
                  value={`${n} out of 5 stars`}
                  required
                />
                <span>{n}</span>
                <small className="sr-only">out of 5 stars</small>
              </label>
            ))}
          </fieldset>
          <label>
            Review <small>{count} / 600</small>
            <textarea
              name="message"
              minLength={20}
              maxLength={600}
              rows={4}
              required
              onChange={(e) => setCount(e.target.value.length)}
            />
          </label>
          <label>
            Project / website URL (optional)
            <input
              name="project_url"
              type="url"
              placeholder="https://"
              maxLength={250}
            />
          </label>
          <label className="consent">
            <input
              type="checkbox"
              name="permission_to_publish"
              value="Yes — permission granted"
              required
            />
            <span>
              I give permission for this review to be displayed publicly on the
              J0hnvexcoder portfolio.
            </span>
          </label>
          <input
            className="honeypot"
            type="checkbox"
            name="botcheck"
            tabIndex={-1}
            aria-hidden="true"
          />
          {open && (
            <FormCaptcha
              resetKey={captchaKey}
              onVerify={(value) => {
                token.current = value;
                setStatus("");
              }}
              onExpire={() => {
                token.current = "";
                setStatus(
                  "Verification expired. Please complete it again before submitting.",
                );
              }}
              onError={() => {
                token.current = "";
                setStatus(
                  "Verification is unavailable. Retry verification, or email your feedback.",
                );
              }}
              onOpen={() => setChallengeOpen(true)}
              onClose={() => setChallengeOpen(false)}
            />
          )}
          <p className="form-status" role="status">
            {status}
          </p>
          <button className="button primary" type="submit" disabled={busy}>
            {busy ? "Sending…" : "Submit review"}
            <ArrowUpRight size={16} />
          </button>
          {status && !busy && (
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                token.current = "";
                setCaptchaKey((k) => k + 1);
                setStatus("Complete a fresh verification, then submit again.");
              }}
            >
              Retry verification
            </button>
          )}
          <p className="form-note">
            Sent through Web3Forms. Your email is used only to verify or follow
            up on your review. Nothing is automatically added to the public
            feedback archive.
          </p>
        </form>
      )}
    </ReviewDialog>
  );
}
