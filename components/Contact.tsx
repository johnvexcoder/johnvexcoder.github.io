import { resumeFileName, resumeHref } from "@/lib/resume";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { profile, contacts } from "@/lib/content";
import Reveal from "./Reveal";
import InquiryForm from "./InquiryForm";
export default function Contact() {
  return (
    <section id="contact" className="section contact-section">
      <Reveal className="contact-copy">
        <h2>Have something in mind?</h2>
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
          {contacts.slice(1).map(([name, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
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
          href={resumeHref}
          download={resumeFileName}
          data-ga-event="resume_download"
          data-ga-location="contact"
        >
          Download résumé ↗
        </a>
        <p className="contact-note">
          Based in the Philippines · UTC+8
          <br />
          Remote and international inquiries welcome.
        </p>
        <Link className="text-link" href="/contact/">
          Have a detailed brief? Plan your project ↗
        </Link>
      </Reveal>
      <Reveal className="contact-form-wrap">
        <div className="inquiry-heading">
          <h3>A short note is enough.</h3>
          <p>Four fields. A clear starting point. All fields are required.</p>
        </div>
        <InquiryForm source="homepage" />
      </Reveal>
    </section>
  );
}
