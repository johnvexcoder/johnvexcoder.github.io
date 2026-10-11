import type { Metadata, Viewport } from "next";
import SceneMotion from "@/components/SceneMotion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { profile } from "@/lib/content";
import {
  siteUrl as url,
  absoluteUrl,
  isIndexable,
  homeSearchTitle,
  homeSearchDescription,
} from "@/lib/seo";
import "./globals.css";
import { introBootstrap } from "@/lib/intro";
import { analyticsBootstrap } from "@/lib/analytics";
import WebVitals from "@/components/WebVitals";
import GoogleAnalytics from "@/components/GoogleAnalytics";
export const viewport: Viewport = { width: "device-width", initialScale: 1 };
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: homeSearchTitle,
    template: "%s | J0hnvexcoder",
  },
  description: homeSearchDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: homeSearchTitle,
    type: "website",
    url: absoluteUrl("/"),
    siteName: "J0hnvexcoder",
    locale: "en_PH",
    description: homeSearchDescription,
    images: [
      {
        url: "/social.png",
        width: 1200,
        height: 630,
        alt: "J0hnvexcoder — From interface to infrastructure. John Angelo De Joya holding his laptop against the portfolio's cinematic network backdrop.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSearchTitle,
    description: homeSearchDescription,
    creator: "@johnvexcoder",
    images: ["/social.png"],
  },
  authors: [{ name: profile.name, url }],
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
  robots: {
    index: isIndexable,
    follow: true,
    googleBot: {
      index: isIndexable,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: profile.name,
    alternateName: [profile.alias, "johnvexcoder", "John De Joya"],
    jobTitle: [
      "Web Developer",
      "Software Developer",
      "Systems & Automation Practitioner",
    ],
    description: homeSearchDescription,
    homeLocation: { "@type": "Place", name: "Bulacan, Philippines" },
    url,
    image: {
      "@type": "ImageObject",
      url: absoluteUrl("/social.png"),
      width: 1200,
      height: 630,
      caption: "John Angelo De Joya, J0hnvexcoder",
    },
    sameAs: [
      "https://github.com/johnvexcoder",
      "https://www.linkedin.com/in/johnvexcoder/",
      "https://x.com/johnvexcoder",
      "https://t.me/j0hnvexcoder",
    ],
    knowsAbout: [
      "Web Development",
      "Python",
      "Linux",
      "Docker",
      "Proxmox",
      "Networking",
      "Self-hosting",
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: analyticsBootstrap }} />
        <link
          rel="preload"
          href="/fonts/SignatureSans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SignatureMono.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replaceAll("<", "\\u003c"),
          }}
        />
        <GoogleAnalytics />
        <SceneMotion />
        {(process.env.NODE_ENV === "development" ||
          process.env.NEXT_PUBLIC_PERFORMANCE_DEBUG === "true") && (
          <WebVitals />
        )}
        <Header />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
