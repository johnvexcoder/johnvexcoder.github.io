import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import EditorialPage, { editorialMetadata } from "@/components/EditorialPage";
import WorkThumbnail from "@/components/WorkThumbnail";
import { publicPage } from "@/lib/public-pages";
import { profile, projects } from "@/lib/content";
export const metadata = editorialMetadata("about");
export default function AboutPage() {
  const page = publicPage("about");
  return (
    <EditorialPage id="about">
      <section className="profile-approach" aria-labelledby="approach-title">
        <div>
          <h2 id="approach-title">Understand. Build. Verify.</h2>
          <p>
            I start with the user and the constraints. Clear interfaces,
            maintainable code and verified deployment belong in the same
            conversation.
          </p>
        </div>
        <div>
          {page.paragraphs.slice(1, 3).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
      <section
        className="profile-practice editorial-section"
        aria-labelledby="practice-title"
      >
        <div className="profile-section-heading">
          <h2 id="practice-title">Across the stack.</h2>
          <p>
            From the part people experience to the systems that keep it working.
          </p>
        </div>
        <div className="capability-ledger">
          {profile.capabilities.map((c) => (
            <section key={c.id}>
              <div>
                <h3>{c.label}</h3>
                <p>{c.title}</p>
              </div>
              <div>
                <p>{c.copy}</p>
                <p className="technology-line">{c.tech.join(" · ")}</p>
              </div>
            </section>
          ))}
        </div>
      </section>
      <section
        className="editorial-section experience-ledger"
        aria-labelledby="experience-title"
      >
        <div className="profile-section-heading">
          <h2 id="experience-title">Experience &amp; delivery.</h2>
          <p>Contract work, client delivery and hands-on technical practice.</p>
        </div>
        <ol>
          {profile.experience.map((e) => (
            <li key={`${e.date}-${e.place}`}>
              <p className="experience-date">{e.date}</p>
              <div>
                <h3>{e.title}</h3>
                <p className="experience-place">{e.place}</p>
                <p>{e.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section
        className="editorial-section profile-evidence"
        aria-labelledby="evidence-title"
      >
        <div className="profile-section-heading">
          <h2 id="evidence-title">Practice, made visible.</h2>
          <Link className="text-link" href="/work/">
            Browse all projects <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="profile-evidence-grid">
          {["jenica-portfolio", "compressme", "homelab-os"].map((id) => {
            const p = projects.find((p) => p.id === id)!;
            return (
              <Link key={id} href={`/work/${id}/`} prefetch={false}>
                <WorkThumbnail project={p} />
                <small>{p.classification}</small>
                <h3>
                  {p.name}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </h3>
                <p>{p.shortDescription}</p>
              </Link>
            );
          })}
        </div>
        <p className="evidence-boundary">
          The homelab is an independent learning and development environment. It
          does not imply client uptime guarantees or enterprise production
          scale.{" "}
          <Link href="/work/homelab-agent/">
            Explore the Linux telemetry agent.
          </Link>
        </p>
      </section>
      <section className="availability-strip">
        <div>
          <h2>Based here. Working remotely.</h2>
          <p>{page.paragraphs[3]}</p>
        </div>
        <Link className="button primary" href="/contact/">
          Let’s discuss your project{" "}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </EditorialPage>
  );
}
