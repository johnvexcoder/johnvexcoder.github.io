import PremiumPageMotion from "@/components/PremiumPageMotion";
/* eslint-disable @next/next/no-img-element -- Static export uses pre-generated responsive WebP variants without an image server. */
import ServiceInquiryLink from "@/components/ServiceInquiryLink";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Search,
  Layers,
  UserRound,
  CalendarDays,
  Workflow,
} from "lucide-react";
import { serviceContent, servicePages, serviceMetadata } from "@/lib/services";
import {
  ServiceCTA,
  ServiceExamples,
  ServiceSchema,
} from "@/components/ServiceContent";
export const metadata = serviceMetadata(serviceContent.main);
const icons = [Code2, Search, Layers, UserRound, CalendarDays, Workflow];
export default function ServicesPage() {
  const { main, care } = serviceContent;
  return (
    <article className="services-page section">
      <PremiumPageMotion />
      <ServiceSchema
        route={main.route}
        name={main.h1}
        description={main.description}
      />
      <header className="services-hero">
        <div>
          <p className="eyebrow">J0HNVEXCODER / INDEPENDENT DEVELOPMENT</p>
          <h1>
            Services <span>& Solutions.</span>
          </h1>
          <p className="services-lead">{main.headline}</p>
          <p>{main.intro}</p>
          <Link className="button primary" href="/#contact">
            Discuss Your Project <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="services-hero-proof">
          <span className="eyebrow">SELECTED PERSONAL PROJECT / ARCHÉON</span>
          <Link
            href="/work/archeon/"
            aria-label="Explore the ARCHÉON architecture visualization case study"
          >
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
          <p className="eyebrow">01 / SERVICES</p>
          <h2 id="service-areas">
            The right scope.
            <br />
            <span>For the actual problem.</span>
          </h2>
          <p>{main.scopeNote}</p>
        </div>
        <div className="service-grid">
          {servicePages.map((page, i) => {
            const Icon = icons[i];
            return (
              <Link key={page.id} className="service-card" href={page.route}>
                <div className="service-card-top">
                  <span className="eyebrow">0{i + 1}</span>
                  <Icon size={23} aria-hidden="true" />
                </div>
                <h3>{page.name}</h3>
                <p>{page.summary}</p>
                <span className="text-link">
                  Explore this service <ArrowUpRight size={15} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <ServiceExamples
        ids={["taitechmarine", "jenica-portfolio", "archeon"]}
        evidence="Two confirmed client websites and an original personal 3D demonstration. I explain what each project implements, how it works and which integrations are not verified."
      />
      <section className="service-process">
        <p className="eyebrow">02 / THE PROCESS</p>
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
          ].map(([title, copy], i) => (
            <div key={title}>
              <span className="eyebrow">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="website-care" className="service-care">
        <p className="eyebrow">03 / AFTER LAUNCH</p>
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
        <p className="eyebrow">04 / BEFORE WE START</p>
        <h2>A few useful distinctions.</h2>
        {[
          [
            "Is each solution tailored to my company?",
            "Yes. Content, administration, integrations and operational requirements are defined around the company’s needs. Existing examples show capabilities rather than a fixed package to copy.",
          ],
          [
            "Can you redesign a website I already have?",
            "Yes. Redesign is included under Business Website Development & Redesign. Useful existing content and URLs are reviewed before deciding what changes.",
          ],
          [
            "Does a working demo mean a complete business system?",
            "No. An interactive frontend, a manually confirmed request and an operational platform have different requirements. The scope and validation must make those boundaries clear.",
          ],
        ].map(([q, a]) => (
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
