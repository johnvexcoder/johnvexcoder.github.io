import PremiumPageMotion from "@/components/PremiumPageMotion";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { projects, actions, isDemoAction } from "@/lib/content";
import { caseStudy } from "@/lib/case-studies";
import { servicePages } from "@/lib/services";
import Preview from "@/components/Preview";
import {
  absoluteUrl,
  projectSocialImage,
  projectSearchTitle,
  projectSearchDescription,
} from "@/lib/seo";
export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ id: p.id }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = projects.find((p) => p.id === id);
  return p
    ? {
        title: projectSearchTitle(p),
        description: projectSearchDescription(p),
        alternates: { canonical: `/work/${id}/` },
        openGraph: {
          siteName: "J0hnvexcoder",
          locale: "en_PH",
          title: `${projectSearchTitle(p)} | J0hnvexcoder`,
          description: projectSearchDescription(p),
          url: absoluteUrl(`/work/${id}/`),
          type: "website",
          images: [
            {
              url: projectSocialImage(p),
              width: 1200,
              height: 630,
              alt: p.image
                ? `${p.name} — actual project screenshot`
                : "John Angelo De Joya, the developer behind this project",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `${projectSearchTitle(p)} | J0hnvexcoder`,
          description: projectSearchDescription(p),
          images: [projectSocialImage(p)],
        },
      }
    : { title: "Project not found" };
}
export default async function Work({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = projects.find((p) => p.id === id);
  if (!p) notFound();
  const story = caseStudy(id);
  const index = projects.indexOf(p);
  const related = story.related
    .map((id) => projects.find((project) => project.id === id)!)
    .filter(Boolean);
  const prev = projects[(index + projects.length - 1) % projects.length],
    next = projects[(index + 1) % projects.length];
  return (
    <article className={`case-study section case-${story.layout}`}>
      <PremiumPageMotion density={story.layout} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": absoluteUrl(`/work/${id}/`),
                url: absoluteUrl(`/work/${id}/`),
                name: p.name,
                description: projectSearchDescription(p),
                primaryImageOfPage: {
                  "@type": "ImageObject",
                  url: absoluteUrl(projectSocialImage(p)),
                  width: 1200,
                  height: 630,
                },
                mainEntity: { "@id": absoluteUrl(`/work/${id}/#project`) },
                isPartOf: { "@id": absoluteUrl("/#website") },
                breadcrumb: { "@id": absoluteUrl(`/work/${id}/#breadcrumbs`) },
              },
              {
                "@type": "CreativeWork",
                "@id": absoluteUrl(`/work/${id}/#project`),
                name: p.name,
                description: story.overview,
                url: absoluteUrl(`/work/${id}/`),
                creator: { "@id": absoluteUrl("/#person") },
                genre: [p.category, story.classification],
                about: p.technologies.map((name) => ({
                  "@type": "Thing",
                  name,
                })),
                ...(p.image
                  ? { image: absoluteUrl(projectSocialImage(p)) }
                  : {}),
                ...(p.id !== "movieflix" && p.demo?.startsWith("https:")
                  ? { sameAs: p.demo }
                  : {}),
              },
              {
                "@type": "BreadcrumbList",
                "@id": absoluteUrl(`/work/${id}/#breadcrumbs`),
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Portfolio",
                    item: absoluteUrl("/"),
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: p.name,
                    item: absoluteUrl(`/work/${id}/`),
                  },
                ],
              },
            ],
          }).replaceAll("<", "\\u003c"),
        }}
      />
      <Link className="text-link" href="/#projects">
        <ArrowLeft size={14} />
        All projects
      </Link>
      <header className="case-heading">
        <p className="eyebrow">
          {p.category} / {story.type}
        </p>
        <h1>{p.name}</h1>
        <p>{story.overview}</p>
        <div className="case-actions">
          {actions(p).map(([n, url]) => (
            <a
              key={n}
              className="button secondary"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              data-ga-event={
                isDemoAction(n) ? "project_demo" : "project_reference"
              }
              data-ga-project={p.id}
              data-ga-action={n}
              data-ga-location="case-study"
            >
              {n}
              <ArrowUpRight size={14} />
            </a>
          ))}
        </div>
        {p.disclaimer && <p className="disclaimer">{p.disclaimer}</p>}
      </header>
      <Preview
        project={{ ...p, imageAlt: story.alt || undefined }}
        large
        priority
      />
      <div className="case-story">
        <div>
          <section>
            <p className="eyebrow">01 / THE PROBLEM</p>
            <h2>{story.problemHeading}</h2>
            <p>{story.problem}</p>
          </section>
          <section>
            <p className="eyebrow">02 / ENGINEERING DECISIONS</p>
            <h2>{story.decisionHeading}</h2>
            <p>{story.approach}</p>
            <p>{story.decisions}</p>
          </section>
          <section>
            <p className="eyebrow">03 / IMPLEMENTED SOLUTION</p>
            <h2>
              {story.layout === "system"
                ? "Implemented capabilities."
                : "What works."}
            </h2>
            <ul className="case-capabilities">
              {story.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow">04 / EVIDENCE & BOUNDARIES</p>
            <h2>
              {story.layout === "compact"
                ? "Result and limits."
                : "Verified scope."}
            </h2>
            <p>{story.result}</p>
            <p>{story.tradeoff}</p>
          </section>
        </div>
        <aside>
          <p className="eyebrow">TECHNICAL TOOLKIT</p>
          <div className="technology-tags">
            {p.technologies.length ? (
              p.technologies.map((t) => <span key={t}>{t}</span>)
            ) : (
              <p>No technology list recorded in the source.</p>
            )}
          </div>
          <p className="eyebrow">PROJECT STATUS</p>
          <p>{story.status}</p>
          <p className="eyebrow">CAPABILITY DEMONSTRATED</p>
          <p>{story.demonstrates}</p>
          <nav aria-label="Related work">
            <p className="eyebrow">RELATED WORK</p>
            <ul>
              {related.map((project) => (
                <li key={project.id}>
                  <Link className="text-link" href={`/work/${project.id}/`}>
                    {project.name}
                    <ArrowUpRight size={12} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link className="text-link" href={`/services/${story.service}/`}>
              Explore{" "}
              {
                servicePages.find((service) => service.id === story.service)!
                  .name
              }{" "}
              <ArrowUpRight size={12} aria-hidden="true" />
            </Link>
          </nav>
        </aside>
      </div>
      <nav className="case-pagination" aria-label="More projects">
        <Link href={`/work/${prev.id}/`}>
          <small>
            <ArrowLeft size={12} />
            Previous build
          </small>
          <strong>{prev.name}</strong>
        </Link>
        <Link href={`/work/${next.id}/`}>
          <small>
            Next build
            <ArrowRight size={12} />
          </small>
          <strong>{next.name}</strong>
        </Link>
      </nav>
    </article>
  );
}
