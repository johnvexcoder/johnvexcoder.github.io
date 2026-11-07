"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import {
  type Project,
  projects,
  categories,
  concepts,
  statusLabel,
  actions,
  isDemoAction,
} from "@/lib/content";
import Preview from "./Preview";
import ProjectLogo from "./ProjectLogo";
import WorkThumbnail from "./WorkThumbnail";
import Reveal from "./Reveal";
import { useProjectLayout } from "@/hooks/useProjectLayout";
export default function Projects({
  directory = false,
}: {
  directory?: boolean;
}) {
  const { list, capture } = useProjectLayout();
  const [expanded, setExpanded] = useState(false);
  const collection = useRef<HTMLDetailsElement>(null);
  const collectionIntent = useRef(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("All"),
    [query, setQuery] = useState(""),
    [featured, setFeatured] = useState(false),
    [kind, setKind] = useState("All projects");
  const matches = projects.filter(
    (p) =>
      (category === "All" || category === p.category) &&
      (kind === "All projects" ||
        (kind === "Client work"
          ? p.classification === "Client work"
          : kind === "Demonstrations"
            ? p.status === "demo"
            : kind === "Infrastructure & tools"
              ? ["CLI", "Infrastructure"].includes(p.category)
              : p.classification !== "Client work" && p.status !== "demo")) &&
      (!featured || p.featured) &&
      `${p.id} ${p.name} ${p.shortDescription} ${p.description} ${p.category} ${p.technologies.join(" ")}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  if (directory)
    matches.sort(
      (a, b) =>
        Number(b.classification === "Client work") -
          Number(a.classification === "Client work") ||
        Number(!!b.image) - Number(!!a.image),
    );
  const renderProject = (p: Project, i: number) =>
    directory ? (
      <article key={p.id} className="work-card" data-ga-project={p.id}>
        <Link
          className="work-card-image"
          href={`/work/${p.id}/`}
          prefetch={false}
        >
          <WorkThumbnail project={p} priority={i === 0} />
        </Link>
        <div className="work-card-copy">
          <div className="work-card-meta">
            <span>
              {p.classification === "Client work"
                ? "Client work"
                : p.status === "demo"
                  ? "Demonstration"
                  : "Independent project"}
            </span>
            <span>{p.category}</span>
          </div>
          <h3>
            <Link
              href={`/work/${p.id}/`}
              prefetch={false}
              data-ga-event="project_explore"
              data-ga-project={p.id}
              data-ga-action="Case study"
              data-ga-location="project-archive"
            >
              {p.name}
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </h3>
          <p>{p.shortDescription}</p>
          <div className="work-card-tech">
            {p.technologies.slice(0, 4).join(" · ")}
          </div>
          <div className="work-card-actions">
            <Link href={`/work/${p.id}/`} prefetch={false}>
              Case study <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            {actions(p)
              .slice(0, 1)
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
                  data-ga-location="project-archive"
                >
                  {name}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
          </div>
        </div>
      </article>
    ) : (
      <details key={p.id} className="archive-project" data-ga-project={p.id}>
        <summary>
          <span className="archive-number">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="archive-name">
            <span className="archive-title">
              {p.logo && <ProjectLogo src={p.logo} />}
              {p.name}
            </span>
            <small>{p.shortDescription}</small>
          </span>
          <span className="archive-category">{p.category}</span>
          <span className="archive-status">
            {p.classification === "Client work"
              ? "Client work"
              : statusLabel(p.status)}
          </span>
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
            <Link
              prefetch={false}
              className="text-link"
              href={`/work/${p.id}/`}
              data-ga-event="project_explore"
              data-ga-project={p.id}
              data-ga-action="Case study"
              data-ga-location="project-archive"
            >
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
    );
  const selected = ["homelab-os", "jenica-portfolio", "compressme"].map(
    (id) => projects.find((p) => p.id === id)!,
  );
  return (
    <section id="projects" className="section projects-section">
      {!directory && (
        <>
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
                    {p.logo && <ProjectLogo src={p.logo} />}0{i + 1} /{" "}
                    {p.category}
                  </span>
                  <span className="project-status">
                    {p.classification === "Client work"
                      ? "Client work"
                      : statusLabel(p.status)}
                  </span>
                  <h3>{p.name}</h3>
                  <p>{p.shortDescription}</p>
                  <div className="technology-tags">
                    {p.technologies.slice(0, 5).map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <Link
                    prefetch={false}
                    className="button secondary"
                    href={`/work/${p.id}/`}
                    data-ga-event="project_explore"
                    data-ga-project={p.id}
                    data-ga-action="Case study"
                    data-ga-location="featured-build"
                  >
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
                            isDemoAction(name)
                              ? "project_demo"
                              : "project_reference"
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
        </>
      )}
      <div
        id="collection"
        className={`project-collection ${directory ? "" : "home-collection"}`}
      >
        {!directory && (
          <Reveal className="collection-heading">
            <div>
              <p className="eyebrow">THE COMPLETE COLLECTION</p>
              <h2>
                A little curiosity.
                <br />A lot of building.
              </h2>
            </div>
            <span>
              {projects.length} projects / {categories.length - 1} categories
            </span>
          </Reveal>
        )}
        {directory && (
          <div className="work-directory-heading">
            <h2>Explore the collection</h2>
            <p>{projects.length} projects</p>
          </div>
        )}
        {directory && (
          <div
            className="work-kind-filters"
            aria-label="Project classifications"
          >
            {[
              "All projects",
              "Client work",
              "Independent applications",
              "Demonstrations",
              "Infrastructure & tools",
            ].map((value) => (
              <button
                key={value}
                aria-pressed={kind === value}
                onClick={(event) => {
                  capture(event.detail > 0);
                  setKind(value);
                }}
              >
                {value}
              </button>
            ))}
          </div>
        )}
        {directory && (
          <div className="work-mobile-filters">
            <label htmlFor="work-kind-select">
              Project type
              <select
                id="work-kind-select"
                value={kind}
                onChange={(e) => {
                  capture(false);
                  setKind(e.target.value);
                }}
              >
                {[
                  "All projects",
                  "Client work",
                  "Independent applications",
                  "Demonstrations",
                  "Infrastructure & tools",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label htmlFor="work-category-select">
              Category
              <select
                id="work-category-select"
                value={category}
                onChange={(e) => {
                  capture(false);
                  setCategory(e.target.value);
                }}
              >
                {categories.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div className="archive-toolbar">
          <div className="category-filters" aria-label="Project categories">
            {categories.map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                onClick={(event) => {
                  capture(event.detail > 0);
                  setCategory(c);
                }}
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
                      capture(false);
                      setQuery("");
                    }
                  }}
                  value={query}
                  onChange={(e) => {
                    capture(false);
                    setQuery(e.target.value);
                  }}
                />
              </div>
              <div className="signature-search-end">
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear project search"
                    onClick={() => {
                      capture(false);
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
              onChange={(e) => {
                capture(false);
                setFeatured(e.target.checked);
              }}
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
          {directory ? (
            <>
              {matches.length} {matches.length === 1 ? "project" : "projects"}{" "}
              shown
            </>
          ) : (
            <>
              {expanded ? matches.length : Math.min(3, matches.length)} of{" "}
              {matches.length} {matches.length === 1 ? "project" : "projects"}{" "}
              shown
            </>
          )}
        </p>
        <div
          ref={list}
          className={`archive-list ${directory ? "work-grid" : ""}`}
        >
          {directory ? (
            matches.map(renderProject)
          ) : (
            <>
              {matches.slice(0, 3).map(renderProject)}
              {matches.length > 3 && (
                <details
                  ref={(element) => {
                    collection.current = element;
                    if (element) element.dataset.enhanced = "";
                  }}
                  open={expanded}
                  className="collection-more"
                  onToggle={(event) => {
                    const disclosure = event.currentTarget;
                    disclosure.dataset.enhanced = "";
                    setExpanded(disclosure.open);
                    if (disclosure.open && collectionIntent.current) {
                      disclosure
                        .querySelector<HTMLElement>(
                          "#collection-remaining .archive-project > summary",
                        )
                        ?.focus({ preventScroll: true });
                    }
                    collectionIntent.current = false;
                  }}
                >
                  <summary
                    aria-controls="collection-remaining"
                    onClick={() => {
                      collectionIntent.current = !collection.current?.open;
                    }}
                  >
                    <span className="collection-more-label">
                      Show More <span aria-hidden="true">+</span>
                    </span>
                    <span className="collection-less-label">
                      Show Less <span aria-hidden="true">−</span>
                    </span>
                  </summary>
                  <div id="collection-remaining">
                    {matches.slice(3).map((p, i) => renderProject(p, i + 3))}
                  </div>
                  {expanded && (
                    <button
                      type="button"
                      className="button secondary collection-collapse"
                      aria-controls="collection-remaining"
                      onClick={() => {
                        const disclosure = collection.current;
                        if (!disclosure) return;
                        disclosure.open = false;
                        setExpanded(false);
                        const summary =
                          disclosure.querySelector<HTMLElement>(
                            ":scope > summary",
                          );
                        summary?.focus({ preventScroll: true });
                        summary?.scrollIntoView({
                          block: "center",
                          behavior: "instant",
                        });
                      }}
                    >
                      Show Less
                    </button>
                  )}
                </details>
              )}
            </>
          )}
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
                capture(false);
                setQuery("");
                setCategory("All");
                setFeatured(false);
                setKind("All projects");
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
