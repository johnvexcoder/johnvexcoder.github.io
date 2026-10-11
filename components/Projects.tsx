"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import {
  projects,
  categories,
  concepts,
  statusLabel,
  actions,
  isDemoAction,
} from "@/lib/content";
import Preview from "./Preview";
import Reveal from "./Reveal";
export default function Projects() {
  const searchInput = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("All"),
    [query, setQuery] = useState(""),
    [featured, setFeatured] = useState(false);
  const matches = projects.filter(
    (p) =>
      (category === "All" || category === p.category) &&
      (!featured || p.featured) &&
      `${p.name} ${p.shortDescription} ${p.description} ${p.category} ${p.technologies.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const selected = ["homelab-os", "jenica-portfolio", "compressme"].map(
    (id) => projects.find((p) => p.id === id)!,
  );
  return (
    <section id="projects" className="section projects-section">
      <Reveal className="section-heading">
        <div>
          <p className="eyebrow">03 / SELECTED BUILDS</p>
          <h2>
            Ideas. <span>Engineered.</span>
          </h2>
        </div>
        <p>
          Independent software, self-hosted products, and considered digital
          interfaces. The work is the evidence.
        </p>
      </Reveal>
      <div className="selected-builds">
        {selected.map((p, i) => (
          <Reveal className={`project-plate plate-${i}`} key={p.id}>
            <div className="project-narrative">
              <span className="project-index">
                {p.logo && (
                  <img
                    className="project-logo"
                    src={p.logo}
                    width={22}
                    height={22}
                    alt=""
                    loading="lazy"
                  />
                )}
                0{i + 1} / {p.category}
              </span>
              <span className="project-status">{statusLabel(p.status)}</span>
              <h3>{p.name}</h3>
              <p>{p.shortDescription}</p>
              <div className="technology-tags">
                {p.technologies.slice(0, 5).map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <Link className="button secondary" href={`/work/${p.id}/`}>
                Explore {p.name} <ArrowUpRight size={16} />
              </Link>
              <div className="project-direct">
                {actions(p)
                  .slice(0, 2)
                  .map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ga-event={
                        isDemoAction(name) ? "project_demo" : "project_reference"
                      }
                      data-ga-project={p.id}
                      data-ga-action={name}
                      data-ga-location="featured-build"
                    >
                      {name}
                      <ArrowUpRight size={12} />
                    </a>
                  ))}
              </div>
            </div>
            <Preview project={p} large />
          </Reveal>
        ))}
      </div>
      <div id="collection" className="project-collection">
        <Reveal className="collection-heading">
          <div>
            <p className="eyebrow">THE COMPLETE COLLECTION</p>
            <h3>
              A little curiosity.
              <br />A lot of building.
            </h3>
          </div>
          <span>
            {projects.length} projects / {categories.length - 1} categories
          </span>
        </Reveal>
        <div className="archive-toolbar">
          <div className="category-filters" aria-label="Project categories">
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div
            className="signature-search-group"
            role="search"
            aria-label="Project collection"
          >
            <label
              className="signature-search-label"
              htmlFor="collection-search"
            >
              PROJECT INDEX{" "}
              <span aria-hidden="true">
                / {String(projects.length).padStart(2, "0")}
              </span>
            </label>
            <div className="archive-search signature-search">
              <span className="signature-search-lens" aria-hidden="true">
                <Search size={17} strokeWidth={1.5} />
              </span>
              <div className="signature-search-field">
                <input
                  ref={searchInput}
                  id="collection-search"
                  type="search"
                  aria-label="Search projects"
                  placeholder="Search projects…"
                  autoComplete="off"
                  spellCheck={false}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && query) {
                      e.preventDefault();
                      setQuery("");
                    }
                  }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="signature-search-end">
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear project search"
                    onClick={() => {
                      setQuery("");
                      searchInput.current?.focus();
                    }}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <span
                    className="signature-search-monogram"
                    aria-hidden="true"
                  >
                    J0
                  </span>
                )}
              </div>
            </div>
          </div>
          <label className="featured-filter">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
        </div>
        <p
          className="archive-count"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {matches.length} {matches.length === 1 ? "project" : "projects"} shown
        </p>
        <div className="archive-list">
          {matches.map((p, i) => (
            <details key={p.id} className="archive-project">
              <summary>
                <span className="archive-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="archive-name">
                  <span className="archive-title">
                    {p.logo && (
                      <img
                        className="project-logo"
                        src={p.logo}
                        width={22}
                        height={22}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    {p.name}
                  </span>
                  <small>{p.shortDescription}</small>
                </span>
                <span className="archive-category">{p.category}</span>
                <span className="archive-status">{statusLabel(p.status)}</span>
                <span className="archive-expand" aria-hidden="true">
                  +
                </span>
              </summary>
              <div className="archive-expanded">
                <Preview project={p} />
                <div>
                  <p>{p.description}</p>
                  {p.disclaimer && <p className="disclaimer">{p.disclaimer}</p>}
                  <div className="technology-tags">
                    {p.technologies.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <Link className="text-link" href={`/work/${p.id}/`}>
                    {p.name} case study <ArrowUpRight size={14} />
                  </Link>
                  {actions(p).map(([name, url]) => (
                    <a
                      key={name}
                      className="text-link"
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-ga-event={
                        isDemoAction(name) ? "project_demo" : "project_reference"
                      }
                      data-ga-project={p.id}
                      data-ga-action={name}
                      data-ga-location="project-archive"
                    >
                      {name}
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
        {!matches.length && (
          <div className="archive-empty">
            <h3>No matching builds.</h3>
            <p>
              Try another project name, technology, or category. Clear the
              search to keep your filters, or reset all filters below.
            </p>
            <button
              className="button secondary"
              onClick={() => {
                setQuery("");
                setCategory("All");
                setFeatured(false);
              }}
            >
              Reset filters
            </button>
          </div>
        )}
        <details className="concepts">
          <summary>
            On the drawing board <span>Three source concepts</span>
          </summary>
          <div>
            {concepts.map((c) => (
              <article key={c.name}>
                <p className="eyebrow">{c.tagline} / CONCEPT</p>
                <h4>{c.name}</h4>
                <p>{c.description}</p>
                <ul>
                  {c.capabilities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </details>
      </div>
    </section>
  );
}
