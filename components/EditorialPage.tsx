import { resumeFileName, resumeHref } from "@/lib/resume";
/* eslint-disable @next/next/no-img-element -- Pre-generated portrait variants support static hosting. */
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import PortraitNetwork from "./PortraitNetwork";
import PremiumPageMotion from "./PremiumPageMotion";
import { absoluteUrl } from "@/lib/seo";
import { publicPage } from "@/lib/public-pages";
export function editorialMetadata(id: string): Metadata {
  const page = publicPage(id);
  const title = page.title.includes("J0hnvexcoder")
    ? page.title
    : `${page.title} | J0hnvexcoder`;
  return {
    title: { absolute: title },
    description: page.description,
    alternates: {
      canonical: page.route,
      types: { "text/markdown": `/markdown/${page.id}.md` },
    },
    openGraph: {
      title,
      description: page.description,
      url: absoluteUrl(page.route),
      type: "website",
      siteName: "J0hnvexcoder",
      locale: "en_PH",
      images: [
        {
          url: "/social.png",
          width: 1200,
          height: 630,
          alt: "John Angelo De Joya — J0hnvexcoder",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: page.description,
      images: ["/social.png"],
    },
  };
}
export default function EditorialPage({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const page = publicPage(id);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":
          id === "about"
            ? "AboutPage"
            : id === "contact"
              ? "ContactPage"
              : "CollectionPage",
        "@id": absoluteUrl(page.route + "#page"),
        url: absoluteUrl(page.route),
        name: page.title,
        description: page.description,
        inLanguage: "en-PH",
        isPartOf: { "@id": absoluteUrl("/#website") },
        about: { "@id": absoluteUrl("/#person") },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.name,
            item: absoluteUrl(page.route),
          },
        ],
      },
    ],
  };
  return (
    <article className={`editorial-page ${id}-page section`}>
      <PremiumPageMotion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
        }}
      />
      <nav className="editorial-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{page.name}</span>
      </nav>
      <header className="editorial-hero">
        <div className="editorial-title">
          <h1>{page.heading}</h1>
          {id === "about" && (
            <p className="editorial-lead">{page.paragraphs[0]}</p>
          )}
          {id === "about" && (
            <div className="profile-actions">
              <Link className="button primary" href="/contact/">
                Discuss a project <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="text-link"
                href={resumeHref}
                download={resumeFileName}
              >
                Download résumé <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
        {id === "about" ? (
          <figure className="profile-portrait">
            <PortraitNetwork />
            <img
              src="/source/me/portrait-480.webp"
              srcSet="/source/me/portrait-320.webp 320w, /source/me/portrait-480.webp 480w, /source/me/portrait-640.webp 640w, /source/me/portrait.webp 960w"
              sizes="(max-width:600px) 255px, 300px"
              width={480}
              height={640}
              alt="John Angelo De Joya, the developer behind J0hnvexcoder"
              fetchPriority="high"
            />
            <figcaption>
              <strong>John Angelo De Joya</strong>
              <span>Web developer · Bulacan, Philippines</span>
            </figcaption>
          </figure>
        ) : (
          <div className="editorial-intro">
            <p className="editorial-lead">{page.paragraphs[0]}</p>
            {id !== "work" && <p>{page.paragraphs[1]}</p>}
          </div>
        )}
      </header>
      {children}
      <nav className="editorial-directory" aria-label="Explore the portfolio">
        {[
          ["About", "/about/"],
          ["Works", "/work/"],
          ["Services", "/services/"],
          ["Contact", "/contact/"],
        ]
          .filter(([, href]) => href !== page.route)
          .map(([name, href]) => (
            <Link key={href} href={href} prefetch={false}>
              <span>
                <small>Explore</small>
                {name}
              </span>
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          ))}
      </nav>
    </article>
  );
}
