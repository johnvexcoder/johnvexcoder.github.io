import "@/app/faq-motion.css";
import "@/app/service-experience.css";
import ServiceIllustration from "@/components/ServiceIllustration";
import PortfolioSEORecord from "@/components/PortfolioSEORecord";
import PremiumPageMotion from "@/components/PremiumPageMotion";
import { notFound } from "next/navigation";
import ServiceInquiryLink from "@/components/ServiceInquiryLink";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { servicePages, serviceMetadata } from "@/lib/services";
import {
  ServiceSchema,
  ServiceCTA,
  ServiceExamples,
  ServiceNavigation,
  ServiceBackLink,
} from "@/components/ServiceContent";
export const dynamicParams = false;
export const generateStaticParams = () =>
  servicePages.map((page) => ({ slug: page.id }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = servicePages.find((page) => page.id === slug);
  return page ? serviceMetadata(page) : { title: "Service not found" };
}
export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = servicePages.find((page) => page.id === slug);
  if (!page) notFound();
  const titles: Record<string, string> = {
    "business-websites": "Plan the new website around its audience.",
    "website-redesign": "Retain useful content. Plan the changes.",
    "crm-development": "Start with the customer relationship.",
    "admin-dashboard-development":
      "Connect the overview to the underlying work.",
    "technical-seo": "Check what is actually published.",
    "cms-solutions": "Start with the editing workflow.",
    "portfolio-websites": "Let the work guide the presentation.",
    "booking-systems": "Define when a request becomes a booking.",
    "custom-solutions": "Choose the architecture around the task.",
  };
  return (
    <article className="services-page service-detail section">
      <PremiumPageMotion />
      <ServiceSchema
        route={page.route}
        name={page.name}
        description={page.description}
        detail
      />
      <ServiceBackLink />
      <header className="service-detail-hero">
        <div className="service-hero-copy">
          <p className="eyebrow">SERVICES & SOLUTIONS / J0HNVEXCODER</p>
          <h1>{page.name}</h1>
          <p className="service-hero-definition">{page.summary}</p>
          <p className="service-hero-audience">{page.heroDetail}</p>
          <div className="service-hero-actions">
            <ServiceInquiryLink service={slug} location="service-hero" />
            <Link
              className="text-link"
              href={
                slug === "technical-seo"
                  ? "#portfolio-evidence"
                  : "#engineering"
              }
            >
              {slug === "technical-seo"
                ? "See delivery evidence"
                : "See how it is engineered"}{" "}
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="service-hero-proof">
            <span>Scoped around your workflow</span>
            <span>Evidence before promises</span>
          </div>
        </div>
        <ServiceIllustration kind={slug} caption={page.visualCaption} />
      </header>
      <div className="service-detail-body">
        <div>
          <section>
            <p className="eyebrow">01 / THE NEED</p>
            <h2>The problem it can address.</h2>
            <p>{page.problem}</p>
          </section>
          <section>
            <p className="eyebrow">02 / THE SOLUTION</p>
            <h2>What the work can include.</h2>
            <p>{page.solution}</p>
          </section>
          <section id={slug === "business-websites" ? "redesign" : "approach"}>
            <p className="eyebrow">03 / THE APPROACH</p>
            <h2>{titles[slug]}</h2>
            <p>{page.distinctSection}</p>
            {page.contextLinks.map((link) => (
              <p key={link.route}>
                <Link className="text-link" href={link.route}>
                  {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </p>
            ))}
          </section>
        </div>
        <aside className="service-scope">
          <p className="eyebrow">SCOPE TO AGREE</p>
          <h2>Built for your requirements.</h2>
          <ul>
            {page.scope.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            The final requirements follow your company’s content, people and
            systems. Features and integrations are confirmed before
            implementation.
          </p>
          <div className="service-deliverables">
            <h3>What you receive</h3>
            <ul>
              {page.engineering.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <Link className="text-link" href="/services/#website-care">
            Website Care and Maintenance <ArrowUpRight size={14} />
          </Link>
        </aside>
      </div>
      <section
        id="engineering"
        className="service-engineering"
        aria-labelledby="engineering-heading"
      >
        <div className="service-engineering-heading">
          <div>
            <p className="eyebrow">THE ENGINEERING / SCOPE TO VERIFY</p>
            <h2 id="engineering-heading">{page.engineering.heading}</h2>
          </div>
          <p>{page.engineering.intro}</p>
        </div>
        <ol className="engineering-steps">
          {page.engineering.steps.map(([title, copy], index) => (
            <li key={title}>
              <small>{String(index + 1).padStart(2, "0")} / DELIVERY</small>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
        <div className="engineering-inputs">
          <div>
            <h3>What helps us start</h3>
            <p>{page.engineering.inputs}</p>
            <ul
              className="technology-notes"
              aria-label="Implementation considerations"
            >
              {page.engineering.tech.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Boundaries to agree</h3>
            <p>{page.engineering.considerations}</p>
          </div>
        </div>
      </section>
      <ServiceExamples ids={page.examples} evidence={page.evidence} />
      {page.portfolioCase && <PortfolioSEORecord record={page.portfolioCase} />}
      {slug === "technical-seo" && (
        <p className="service-inline-link">
          <Link className="text-link" href="/">
            Inspect the J0hnvexcoder portfolio <ArrowUpRight size={14} />
          </Link>
        </p>
      )}
      <section className="service-faq">
        <p className="eyebrow">QUESTIONS ABOUT THIS SERVICE</p>
        <h2>Scope, explained clearly.</h2>
        {page.faq.map(([q, a]) => (
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
      <ServiceCTA service={slug} />
      <ServiceNavigation current={slug} />
    </article>
  );
}
