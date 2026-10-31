import EditorialPage, { editorialMetadata } from "@/components/EditorialPage";
import InquiryForm from "@/components/InquiryForm";
import { profile } from "@/lib/content";
export const metadata = editorialMetadata("contact");
export default function ContactPage() {
  return (
    <EditorialPage id="contact">
      <div className="consultation-layout">
        <aside className="consultation-note">
          <h2>A considered start.</h2>
          <p>
            A useful brief explains the audience, the goal and what is getting
            in the way. Links to your current site or reference work help.
          </p>
          <p>
            Share a budget range and currency if useful. These details help
            scope a conversation; they are not a service price or commitment.
          </p>
          <a
            className="text-link"
            href={`mailto:${profile.email}`}
            data-ga-event="contact_email_click"
            data-ga-location="contact"
          >
            {profile.email} ↗
          </a>
          <div className="consultation-steps">
            <h3>What happens next</h3>
            <ol>
              <li>I review your goals and existing work.</li>
              <li>We clarify scope, constraints and fit.</li>
              <li>We discuss a practical next step.</li>
            </ol>
          </div>
          <p className="contact-note">
            Philippines · UTC+8
            <br />
            Remote collaboration by arrangement.
          </p>
        </aside>
        <section className="consultation-form" aria-labelledby="brief-title">
          <h2 id="brief-title">Your project brief.</h2>
          <p className="inquiry-hint">
            Fields marked * are required. Planning details are optional.
          </p>
          <InquiryForm source="contact_page" />
        </section>
      </div>
    </EditorialPage>
  );
}
