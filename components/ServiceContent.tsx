import ServiceInquiryLink from "./ServiceInquiryLink";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import Preview from "./Preview";
import { projects } from "@/lib/content";
import { caseStudy } from "@/lib/case-studies";
import { absoluteUrl } from "@/lib/seo";
import { servicePages } from "@/lib/services";

export function ServiceSchema({
  route,
  name,
  description,
  detail = false,
}: {
  route: string;
  name: string;
  description: string;
  detail?: boolean;
}) {
  const crumbs = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Portfolio",
      item: absoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services and Solutions",
      item: absoluteUrl("/services/"),
    },
  ];
  if (detail)
    crumbs.push({
      "@type": "ListItem",
      position: 3,
      name,
      item: absoluteUrl(route),
    });
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": absoluteUrl(route),
              url: absoluteUrl(route),
              name,
              description,
              isPartOf: { "@id": absoluteUrl("/#website") },
              breadcrumb: { "@id": absoluteUrl(`${route}#breadcrumbs`) },
              ...(detail
                ? { mainEntity: { "@id": absoluteUrl(`${route}#service`) } }
                : {}),
            },
            {
              "@type": "BreadcrumbList",
              "@id": absoluteUrl(`${route}#breadcrumbs`),
              itemListElement: crumbs,
            },
            ...(detail
              ? [
                  {
                    "@type": "Service",
                    "@id": absoluteUrl(`${route}#service`),
                    name,
                    description,
                    url: absoluteUrl(route),
                    provider: { "@id": absoluteUrl("/#person") },
                    areaServed: { "@type": "Country", name: "Philippines" },
                  },
                ]
              : []),
          ],
        }).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
export function ServiceCTA({ service }: { service?: string }) {
  return (
    <section className="service-cta">
      <div>
        <p className="eyebrow">LET’S DEFINE THE WORK</p>
        <h2>
          Tell me what needs
          <br />
          to work better.
        </h2>
        <p>
          Share the current situation, who the website or system serves, and
          what you need it to do. We can discuss the requirements before
          defining a proposal.
        </p>
      </div>
      <ServiceInquiryLink service={service} />
    </section>
  );
}
export function ServiceExamples({
  ids,
  evidence,
}: {
  ids: string[];
  evidence: string;
}) {
  return (
    <section className="service-examples">
      <p className="eyebrow">WORK YOU CAN INSPECT</p>
      <h2>Selected work. Real context.</h2>
      <p>{evidence}</p>
      <div className={`service-work-list ${ids.length === 2 ? "two-up" : ""}`}>
        {ids.map((id) => {
          const project = projects.find((p) => p.id === id)!;
          const study = caseStudy(id);
          return (
            <article key={id} className="selected-work-card">
              <Preview project={project} />
              <Link prefetch={false} href={`/work/${id}/`}>
                <div className="selected-work-copy">
                  <small>
                    {study.classification} /{" "}
                    {id === "compressme"
                      ? "Desktop & CLI utility"
                      : id === "homelab-os"
                        ? "Release-candidate system"
                        : id === "homelab-agent"
                          ? "Linux telemetry tool"
                          : id === "movieflix"
                            ? "Private application"
                            : project.status === "demo"
                              ? "Website demonstration"
                              : "Published website"}
                  </small>
                  <h3>
                    {project.name}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </h3>
                  <p>{study.overview}</p>
                  <ul>
                    {study.features.slice(0, 2).map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <span className="text-link">
                    View Case Study <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
      {!ids.length && (
        <Link prefetch={false} className="text-link" href="/#projects">
          Explore the current project collection <ArrowRight size={15} />
        </Link>
      )}
    </section>
  );
}
export function ServiceNavigation({ current }: { current: string }) {
  return (
    <nav className="service-navigation" aria-label="Other services">
      <p className="eyebrow">OTHER WAYS TO WORK TOGETHER</p>
      {servicePages
        .filter((p) => p.id !== current)
        .map((p) => (
          <Link key={p.id} href={p.route}>
            {p.name}
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        ))}
    </nav>
  );
}
export function ServiceBackLink() {
  return (
    <Link prefetch={false} className="text-link" href="/services/">
      <ArrowLeft size={14} /> All services & solutions
    </Link>
  );
}
