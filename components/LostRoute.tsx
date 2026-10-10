"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowLeft, Search, Compass } from "lucide-react";
import { projects } from "@/lib/content";
export default function LostRoute() {
  const [query, setQuery] = useState(""),
    [ping, setPing] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const results = projects
    .filter((p) =>
      `${p.name} ${p.category} ${p.technologies.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
    )
    .slice(0, 3);
  return (
    <section
      className="lost-experience"
      data-motion-scene="lost"
      data-ping={ping}
      aria-labelledby="lost-title"
    >
      <div className="lost-masthead">
        <span className="eyebrow">404 / BEYOND THE KNOWN ROUTE</span>
        <span>J0 / INDEPENDENT TECHNICAL PRACTICE</span>
      </div>
      <div className="lost-layout">
        <div className="lost-world" aria-hidden="true">
          <div className="lost-light" />
          <svg viewBox="0 0 680 600" className="lost-topology">
            <g className="lost-depth">
              {Array.from({ length: 7 }, (_, i) => (
                <g key={i} style={{ animationDelay: `${i * -2.4}s` }}>
                  <polygon points="340,60 555,180 555,420 340,540 125,420 125,180" />
                  <circle cx="340" cy="60" r="3" />
                  <circle cx="555" cy="420" r="3" />
                  <circle cx="125" cy="180" r="3" />
                </g>
              ))}
            </g>
            <path
              className="lost-links"
              d="M60 300H210 M470 300H620 M340 65V170 M340 430V535"
            />
            <path
              className="lost-signal"
              pathLength={1}
              d="M60 300H210L340 430L470 300H620"
            />
            <path
              className="lost-reroute"
              pathLength={1}
              d="M60 300H210L340 170L470 300H620"
            />
            <g className="lost-sources">
              <circle cx="60" cy="300" r="7" />
              <circle cx="620" cy="300" r="7" />
              <circle cx="340" cy="65" r="4" />
              <circle cx="340" cy="535" r="4" />
            </g>
            <circle className="lost-ping-ring" cx="340" cy="300" r="60" />
          </svg>
          <div className="lost-digits">
            <span>4</span>
            <span className="lost-zero">
              0<Compass size={50} />
            </span>
            <span>4</span>
          </div>
          <span className="lost-coordinate coordinate-source">
            SOURCE / CONNECTED
          </span>
          <span className="lost-coordinate coordinate-destination">
            DESTINATION / UNKNOWN
          </span>
        </div>
        <div className="lost-reader">
          <p className="eyebrow">A WRONG TURN. A NEW CONNECTION.</p>
          <h1 id="lost-title">
            Some routes end.
            <br />
            <span>Curiosity doesn’t.</span>
          </h1>
          <p>
            The page you’re looking for isn’t here. The work, the ideas, and the
            person behind them still are.
          </p>
          <div className="lost-actions">
            <Link className="button primary" href="/">
              <ArrowLeft size={16} />
              Back to the portfolio
            </Link>
            <button
              className="button secondary"
              disabled={ping}
              onClick={() => {
                setPing(true);
                clearTimeout(timeout.current);
                timeout.current = setTimeout(() => setPing(false), 1800);
              }}
            >
              Trace a new route
              <ArrowUpRight size={16} />
            </button>
          </div>
          <p className="lost-route-status" role="status">
            {ping
              ? "A path to the portfolio is always available."
              : "HTTP 404 · This destination could not be found."}
          </p>
          <div className="lost-finder">
            <label htmlFor="lost-search">Find something worth exploring</label>
            <div className="archive-search">
              <Search size={16} />
              <input
                id="lost-search"
                type="search"
                placeholder="Search the real project collection"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <nav aria-label="Suggested projects">
              {results.map((p) => (
                <Link key={p.id} href={`/work/${p.id}/`}>
                  <span>
                    <strong>{p.name}</strong>
                    <small>{p.category}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </Link>
              ))}
            </nav>
            {!results.length && (
              <p>
                No matching builds.{" "}
                <Link href="/#projects">
                  Browse all projects
                  <ArrowUpRight size={12} />
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="lost-endnote">
        <span>NO DATA LOST. JUST A DIFFERENT PATH.</span>
        <Link href="/#contact">
          Need a hand?
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}
