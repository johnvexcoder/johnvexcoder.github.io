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
    "business-websites": "Retain what works. Improve what doesn’t.",
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
        <p className="eyebrow">SERVICES & SOLUTIONS / J0HNVEXCODER</p>
        <h1>{page.name}</h1>
        <p>{page.summary}</p>
        <ServiceInquiryLink service={slug} />
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
            {slug === "business-websites" && (
              <ServiceInquiryLink
                service="website-redesign"
                label="Discuss a website redesign"
                className="text-link"
              />
            )}
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
          <Link className="text-link" href="/services/#website-care">
            Website Care & Maintenance <ArrowUpRight size={14} />
          </Link>
        </aside>
      </div>
      <ServiceExamples ids={page.examples} evidence={page.evidence} />
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
