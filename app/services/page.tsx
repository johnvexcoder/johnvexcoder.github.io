import "@/app/faq-motion.css";
import { premiumStyles } from "@/lib/premium-styles";
import PremiumPageMotion from "@/components/PremiumPageMotion";
/* eslint-disable @next/next/no-img-element -- Static export uses pre-generated responsive WebP variants without an image server. */
import ServiceInquiryLink from "@/components/ServiceInquiryLink";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceIcon } from "@/lib/service-icons";
import { serviceContent, servicePages, serviceMetadata } from "@/lib/services";
import {
  ServiceCTA,
  ServiceExamples,
  ServiceSchema,
} from "@/components/ServiceContent";
export const metadata = serviceMetadata(serviceContent.main);
export default function ServicesPage() {
  const { main, care } = serviceContent;
  return (
    <article className="services-page section">
      <style>{premiumStyles}</style>
      <PremiumPageMotion />
      <ServiceSchema
        route={main.route}
        name={main.h1}
        description={main.description}
      />
      <header className="services-hero">
        <div>
          <h1>Services and solutions.</h1>
          <p className="services-lead">{main.headline}</p>
          <p>{main.intro}</p>
          <Link className="button primary" href="/contact/">
            Discuss Your Project <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="services-hero-proof">
          <span className="service-proof-label">
            Personal project · ARCHÉON
          </span>
          <Link href="/work/archeon/">
            <img
              src="/services/work/archeon-960.webp"
              srcSet="/services/work/archeon-480.webp 480w, /services/work/archeon-960.webp 960w"
              sizes="(max-width:760px) calc(100vw - 44px), 42vw"
              width={1600}
              height={900}
              alt="ARCHÉON architecture visualization showing the original house concept"
              fetchPriority="high"
              decoding="async"
            />
            <span>
              Original 3D experience <ArrowUpRight size={17} />
            </span>
          </Link>
          <p>
            A frontend demonstration with staged construction, floor exploration
            and local brief download.
          </p>
        </div>
      </header>
      <section className="service-offerings" aria-labelledby="service-areas">
        <div className="service-section-title">
          <h2 id="service-areas">Built around the actual problem.</h2>
          <p>{main.scopeNote}</p>
        </div>
        <div className="service-grid premium-services">
          {servicePages.map((page) => {
            const Icon = serviceIcon(page.id);
            return (
              <article key={page.id} className="premium-service">
                <Icon
                  className="service-ledger-icon"
                  size={22}
                  aria-hidden="true"
                />
                <Link
                  className="service-stretched-link service-card-primary"
                  href={page.route}
                >
                  <h3>{page.name}</h3>
                  <span className="service-learn-more text-link">
                    Learn More <ArrowUpRight size={15} aria-hidden="true" />
                  </span>
                </Link>
                <p>{page.summary}</p>
                <div className="service-card-actions">
                  <Link
                    className="button primary service-contact-button"
                    href={`/contact/?service=${page.id}`}
                    aria-label={`Contact Me about ${page.name}`}
                    data-ga-event="service_inquiry_click"
                    data-ga-service-id={page.id}
                    data-ga-location="service-detail"
                  >
                    Contact Me <ArrowUpRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      <ServiceExamples
        ids={["atlas-enterprise", "jenica-portfolio", "taitechmarine"]}
        evidence="A personal operations demonstration and two confirmed client website projects. Each case study explains its implemented features, project status and integration limits."
      />
      <section className="service-process">
        <h2>Define it before building it.</h2>
        <div>
          {[
            [
              "Understand",
              "Review the audience, existing content, workflow and systems. Identify the problem and what a useful outcome looks like.",
            ],
            [
              "Shape the scope",
              "Agree on pages, content, permissions, integrations and the checks needed to accept the work.",
            ],
            [
              "Build and verify",
              "Develop the agreed solution, test its real behavior, and review the desktop and mobile experience.",
            ],
            [
              "Plan the handover",
              "Clarify deployment, content editing and any agreed care, with working and unfinished functionality recorded clearly.",
            ],
          ].map(([title, copy]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="website-care" className="service-care">
        <h2>{care.name}</h2>
        <p>{care.copy}</p>
        <p>{care.boundary}</p>
        <ServiceInquiryLink
          service="website-care"
          label="Discuss website care"
          className="text-link"
        />
      </section>
      <section className="service-faq">
        <h2>A few useful distinctions.</h2>
        {main.faq.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <div className="faq-answer">
              <p>{a}</p>
            </div>
          </details>
        ))}
      </section>
      <ServiceCTA />
    </article>
  );
}
