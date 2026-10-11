import AssemblyBridge from "@/components/AssemblyBridge";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Infrastructure from "@/components/Infrastructure";
import ProfessionalSystem from "@/components/ProfessionalSystem";
import {
  Skills,
  Experience,
  Services,
  About,
} from "@/components/ProfileSections";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Reveal from "@/components/Reveal";
import { absoluteUrl, homeSearchDescription } from "@/lib/seo";
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "@id": absoluteUrl("/#profile"),
            url: absoluteUrl("/"),
            name: "John Angelo De Joya — J0hnvexcoder",
            description: homeSearchDescription,
            isPartOf: { "@id": absoluteUrl("/#website") },
            mainEntity: { "@id": absoluteUrl("/#person") },
            primaryImageOfPage: {
              "@type": "ImageObject",
              url: absoluteUrl("/social.png"),
              width: 1200,
              height: 630,
            },
          }).replaceAll("<", "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            url: absoluteUrl("/"),
            name: "J0hnvexcoder",
            alternateName: ["johnvexcoder", "John Angelo De Joya Portfolio"],
            description: homeSearchDescription,
            inLanguage: "en-PH",
            author: { "@id": absoluteUrl("/#person") },
          }).replaceAll("<", "\\u003c"),
        }}
      />
      <Hero />
      <section id="introduction" className="introduction section">
        <Reveal>
          <p className="eyebrow">02 / AN INDEPENDENT TECHNICAL PRACTICE</p>
          <h2>
            The interface is
            <br />
            only the <span>beginning.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p>
            I’m John Angelo De Joya (J0hnvexcoder), a freelance web developer in
            Bulacan, Philippines. I build practical software and the systems
            that give it a home.
          </p>
          <p>
            My work spans web development in the Philippines, automation, and
            Linux infrastructure — from the first interaction to the last
            server.
          </p>
          <a className="text-link" href="#about">
            Meet the person behind the work <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </section>
      <AssemblyBridge />
      <Projects />
      <Infrastructure />
      <ProfessionalSystem />
      <Skills />
      <Experience />
      <Services />
      <Testimonials />
      <About />
      <Contact />
    </>
  );
}
