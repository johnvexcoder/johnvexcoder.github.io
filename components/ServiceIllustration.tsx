import "@/app/service-workflows.css";
import type { ReactNode } from "react";
import ServiceWorkflowMotion from "./ServiceWorkflowMotion";
import { chartSeries, workflows } from "@/lib/workflow-motion";

function Stage({
  index,
  children,
  className = "",
}: {
  index: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div data-stage={index} className={"workflow-stage " + className}>
      {children}
    </div>
  );
}
function Steps({ items }: { items: readonly string[] }) {
  return (
    <div className="workflow-step-strip">
      {items.map((x, i) => (
        <div key={x}>
          <span>{String(i + 1).padStart(2, "0")}</span>
          {x}
          <i data-stage={i} />
        </div>
      ))}
    </div>
  );
}
function Check({
  children,
  warn = false,
}: {
  children: ReactNode;
  warn?: boolean;
}) {
  return (
    <div className={"work-check " + (warn ? "work-warn" : "")}>
      <span>{warn ? "!" : "✓"}</span>
      {children}
    </div>
  );
}
function Booking() {
  return (
    <div className="booking-workspace">
      <div className="work-calendar">
        <div className="work-section-line">
          <b>December 2026</b>
          <span>‹　›</span>
        </div>
        <div className="work-calendar-grid">
          {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
            <small key={i}>{d}</small>
          ))}
          <span />
          {Array.from({ length: 31 }, (_, i) => (
            <span key={i} className={i === 13 ? "work-date" : ""}>
              {i + 1}
              {i === 13 && <i data-stage={0} />}
            </span>
          ))}
        </div>
        <div className="work-calendar-note">
          <i />
          Available appointments
        </div>
      </div>
      <div className="workflow-stage-stack booking-checkout">
        <Stage index={0}>
          <small>AVAILABLE TIMES</small>
          <strong className="work-heading">Monday, 14 December</strong>
          <div className="work-time-slots">
            <span>09:00</span>
            <b>10:30</b>
            <span>14:00</span>
          </div>
          <p>Select a time for your visit.</p>
          <span className="work-action">Choose this time →</span>
        </Stage>
        <Stage index={1}>
          <small>YOUR RESERVATION</small>
          <strong className="work-heading">Review your booking</strong>
          <dl>
            <div>
              <dt>Appointment</dt>
              <dd>14 Dec · 10:30</dd>
            </div>
            <div>
              <dt>Duration</dt>
              <dd>60 minutes</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>₱1,200.00</dd>
            </div>
          </dl>
          <span className="work-action">Book now →</span>
        </Stage>
        <Stage index={2}>
          <small>SECURE CHECKOUT</small>
          <strong className="work-heading">Complete payment</strong>
          <div className="work-payment">
            <span>CARD PAYMENT</span>
            <b>••••　••••　••••　4242</b>
            <span>₱1,200.00　 /　 Processing</span>
          </div>
          <div className="work-progress">
            <i data-scan="2" />
          </div>
        </Stage>
        <Stage index={3}>
          <span className="work-success-mark">✓</span>
          <strong className="work-heading">Reservation ready</strong>
          <p>BK-042 · 14 Dec · 10:30</p>
          <Check>Payment received · ₱1,200.00</Check>
          <small>A confirmation is ready to send.</small>
        </Stage>
      </div>
    </div>
  );
}
function Dashboard() {
  return (
    <div className="dashboard-workspace">
      <div className="work-section-line">
        <b>Business overview</b>
        <span>WEEKLY REPORT</span>
      </div>
      <div className="work-kpis">
        <div>
          <small>INCOME</small>
          <div className="workflow-stage-stack">
            {chartSeries.map((series, i) => (
              <Stage key={i} index={i}>
                <b>
                  ₱
                  {Math.round(
                    series.reduce((a, v) => a + v, 0) * 10000,
                  ).toLocaleString("en-PH")}
                </b>
              </Stage>
            ))}
          </div>
          <span>Seven-day total</span>
        </div>
        <div>
          <small>INVENTORY</small>
          <b>24</b>
          <span>Units available</span>
        </div>
        <div>
          <small>OPEN TASKS</small>
          <b>08</b>
          <span>3 due today</span>
        </div>
      </div>
      <div className="work-chart-heading">
        <b>Income by day</b>
        <span>PHP · rolling week</span>
      </div>
      <svg
        className="work-report-chart"
        viewBox="0 0 420 126"
        aria-hidden="true"
      >
        <g className="work-chart-grid">
          <path d="M0 26H420M0 66H420M0 106H420" />
        </g>
        {chartSeries[0].map((value, i) => (
          <rect
            key={i}
            data-chart-bar={i}
            x={20 + i * 57}
            y={106 - value * 100}
            width="25"
            height={value * 100}
            rx="4"
          />
        ))}
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <text key={i} x={33 + i * 57} y="123" textAnchor="middle">
            {day}
          </text>
        ))}
      </svg>
      <div className="work-activity">
        <div>
          <span className="work-status-dot" />
          <b>BK-042</b>
          <span>Payment received</span>
          <strong>₱1,200</strong>
        </div>
        <div>
          <span className="work-status-dot" />
          <b>Stock</b>
          <span>24 units available</span>
          <strong>In stock</strong>
        </div>
        <div>
          <span className="work-status-dot amber" />
          <b>Task #08</b>
          <span>Prepare weekly report</span>
          <strong>Due today</strong>
        </div>
      </div>
    </div>
  );
}
function SEO() {
  const statuses = [
    ["Discovering pages", "/services/ · queued", "Checking response headers"],
    ["200 OK · crawlable", "Metadata & schema", "Comparing canonical targets"],
    [
      "Canonical mismatch",
      "/staging/ ≠ /services/",
      "One issue needs a correction",
    ],
    ["Correct canonical", "/services/", "Apply the intended page URL"],
    [
      "Validation complete",
      "/services/ · canonical",
      "Metadata, schema & links pass",
    ],
  ];
  return (
    <div className="seo-workspace">
      <div className="work-section-line">
        <b>studio.example</b>
        <span>TECHNICAL AUDIT</span>
      </div>
      <div className="work-progress">
        <i data-scan="0" />
      </div>
      <div className="work-audit-grid">
        <div className="work-audit-checks">
          <Check>Crawl access</Check>
          <Check>Page title & description</Check>
          <Check>Structured data</Check>
          <Check>Internal links</Check>
          <Check>Image dimensions</Check>
        </div>
        <div className="workflow-stage-stack work-console">
          {statuses.map((s, i) => (
            <Stage key={i} index={i}>
              <small>{"AUDIT / " + workflows["technical-seo"][i]}</small>
              <strong className="work-heading">{s[0]}</strong>
              <code>{s[1]}</code>
              <p>{s[2]}</p>
              <span className={"work-state-badge " + (i === 2 ? "amber" : "")}>
                {i === 2
                  ? "Needs attention"
                  : i === 4
                    ? "Verified"
                    : "In progress"}
              </span>
            </Stage>
          ))}
        </div>
      </div>
    </div>
  );
}
function CRM() {
  const labels = workflows["crm-development"];
  return (
    <div className="crm-workspace">
      <div className="work-section-line">
        <b>Sales workspace</b>
        <span>PIPELINE</span>
      </div>
      <div className="work-pipeline">
        {labels.map((x) => (
          <div className="work-lane" key={x}>
            <span>{x}</span>
            <i />
          </div>
        ))}
        <div className="work-moving-lead" data-travel="6">
          <span className="work-avatar">AM</span>
          <b>Alex Morgan</b>
          <small>Website inquiry</small>
        </div>
      </div>
      <div className="workflow-stage-stack work-crm-record">
        <Stage index={0}>
          <small>INCOMING INQUIRY</small>
          <strong className="work-heading">A new conversation</strong>
          <p>Business website · Initial consultation</p>
          <Check>Contact record created</Check>
        </Stage>
        <Stage index={1}>
          <small>OWNER ASSIGNED</small>
          <strong className="work-heading">Ready for a response</strong>
          <p>Assigned to Jamie · Sales</p>
          <Check>Requirements attached</Check>
        </Stage>
        <Stage index={2}>
          <small>CONTACTED</small>
          <strong className="work-heading">
            The conversation moves forward
          </strong>
          <p>Introduction sent · Scope discussion</p>
          <Check>Activity logged to contact</Check>
        </Stage>
        <Stage index={3}>
          <small>FOLLOW-UP TASK</small>
          <strong className="work-heading">Keep the next step clear</strong>
          <p>Send proposal · Tomorrow, 10:00</p>
          <Check>Reminder added to Jamie’s tasks</Check>
        </Stage>
      </div>
    </div>
  );
}
function CMS() {
  return (
    <div className="cms-workspace">
      <div className="work-section-line">
        <b>Content workspace</b>
        <span>EDITORIAL</span>
      </div>
      <div className="work-split">
        <div className="work-editor">
          <small>ARTICLE / COMPANY NEWS</small>
          <strong className="work-heading">A clearer way to work.</strong>
          <p>Thoughtful systems make everyday work simpler.</p>
          <div className="work-editor-line" />
          <div className="work-editor-line short" />
          <span className="work-editor-cursor" data-stage={0}>
            │
          </span>
          <small>AUTHOR　 Jamie</small>
        </div>
        <div className="workflow-stage-stack work-editor-state">
          <Stage index={0}>
            <small>01 / DRAFT</small>
            <strong className="work-heading">Shape the story.</strong>
            <p>Write, structure and save the content.</p>
            <span className="work-state-badge">Draft saved</span>
          </Stage>
          <Stage index={1}>
            <small>02 / REVIEW</small>
            <strong className="work-heading">Check the details.</strong>
            <Check>Content reviewed</Check>
            <Check>Preview checked</Check>
            <span className="work-state-badge">Ready for approval</span>
          </Stage>
          <Stage index={2}>
            <small>03 / APPROVAL</small>
            <strong className="work-heading">Ready to publish.</strong>
            <Check>Editor approved</Check>
            <p>Permissions verified before publishing.</p>
          </Stage>
          <Stage index={3}>
            <small>04 / PUBLICATION</small>
            <div className="work-publication-art" />
            <strong className="work-heading">A clearer way to work.</strong>
            <span className="work-state-badge">Published in preview</span>
          </Stage>
        </div>
      </div>
    </div>
  );
}
function Applications() {
  const code = [
    "Save project →",
    "POST /api/projects",
    "role: editor · allowed",
    "UPDATE projects SET…",
    "200 OK · changes saved",
  ];
  return (
    <div className="app-workspace">
      <div className="work-section-line">
        <b>Project workspace</b>
        <span>REQUEST TRACE</span>
      </div>
      <div className="work-request-path">
        {["Frontend", "API", "Access", "Database", "Response"].map((x, i) => (
          <div key={x}>
            <span>{"0" + (i + 1)}</span>
            <b>{x}</b>
            <i data-stage={i} />
          </div>
        ))}
        <div className="work-packet" data-travel="0">
          <i />
        </div>
      </div>
      <div className="workflow-stage-stack work-request-console">
        {code.map((x, i) => (
          <Stage key={i} index={i}>
            <small>{workflows["custom-solutions"][i]}</small>
            <strong className="work-heading">
              {
                [
                  "A user makes a change.",
                  "Validate the request.",
                  "Check access rights.",
                  "Save the new record.",
                  "Return a useful result.",
                ][i]
              }
            </strong>
            <code>{x}</code>
            <span className="work-state-badge">
              {i === 4 ? "Saved successfully" : "Request / 042"}
            </span>
          </Stage>
        ))}
      </div>
      <div className="work-request-footer">
        <span>Project / Website refresh</span>
        <span>Authenticated session</span>
      </div>
    </div>
  );
}
function MiniWebsite({
  legacy = false,
  skeleton = false,
}: {
  legacy?: boolean;
  skeleton?: boolean;
}) {
  return (
    <div
      className={
        "work-mini-website " +
        (legacy ? "old-site" : "") +
        (skeleton ? " site-skeleton" : "")
      }
    >
      <div className="work-mini-nav">
        <b>FIELD / STUDIO</b>
        <span>Work　About　Contact</span>
      </div>
      <div className="work-mini-content">
        <small>DESIGN THAT WORKS</small>
        <strong className="work-heading">
          Good work.
          <br />
          Clearly presented.
        </strong>
        <p>Useful websites for the next chapter.</p>
        <span className="work-action">Let’s talk ↗</span>
      </div>
      <div className="work-mini-tiles">
        <span>Services</span>
        <span>Selected work</span>
        <span>Contact</span>
      </div>
    </div>
  );
}
function Website({ redesign = false }: { redesign?: boolean }) {
  return (
    <div className="site-workspace">
      <div className="workflow-stage-stack work-site-preview">
        <Stage index={0}>
          <MiniWebsite legacy={redesign} skeleton={!redesign} />
          <span className="work-view-label">
            {redesign
              ? "Existing interface / audit"
              : "Layout / section structure"}
          </span>
        </Stage>
        <Stage index={1}>
          <MiniWebsite />
          <span className="work-view-label">
            {redesign
              ? "A clearer hierarchy"
              : "Content / services and purpose"}
          </span>
        </Stage>
        <Stage index={2} className="work-responsive-stage">
          <MiniWebsite />
          <div className="work-phone">
            <i />
            <small>FIELD</small>
            <b>
              Good
              <br />
              work.
            </b>
            <span className="work-action">Let’s talk ↗</span>
          </div>
          <span className="work-view-label">
            Responsive / desktop to mobile
          </span>
        </Stage>
        <Stage index={3}>
          <MiniWebsite />
          {redesign ? (
            <span className="work-finish-badge">
              ✓ Consistent across viewports
            </span>
          ) : (
            <div className="work-inquiry-toast">
              <span>✓</span>
              <div>
                <b>A new conversation</b>
                <small>Website inquiry / Ready for review</small>
              </div>
            </div>
          )}
          <span className="work-view-label">
            {redesign
              ? "Finished / ready for review"
              : "Inquiry / clear next step"}
          </span>
        </Stage>
      </div>
    </div>
  );
}
function Portfolio() {
  return (
    <div className="portfolio-workspace">
      <div className="work-section-line">
        <b>Selected work</b>
        <span>DESIGN / BUILD</span>
      </div>
      <div className="workflow-stage-stack work-portfolio-preview">
        <Stage index={0}>
          <div className="work-gallery">
            {["Interface", "Systems", "Experience"].map((x, i) => (
              <div key={x} className={"gallery-art art-" + i}>
                <span>{x}</span>
                <b>{"0" + (i + 1)}</b>
              </div>
            ))}
          </div>
          <strong className="work-heading">A project worth exploring.</strong>
          <small>Select a project to inspect the work.</small>
        </Stage>
        <Stage index={1}>
          <div className="work-case-art" />
          <small>PROJECT / INTERFACE STUDY</small>
          <strong className="work-heading">
            From problem to useful interface.
          </strong>
          <p>Context → design decisions → implementation</p>
        </Stage>
        <Stage index={2}>
          <small>HOW IT WAS BUILT</small>
          <strong className="work-heading">
            The right tools for the work.
          </strong>
          <div className="work-stack-tags">
            <span>Next.js</span>
            <span>React</span>
            <span>TypeScript</span>
          </div>
          <div className="work-editor-line" />
          <p>Responsive components and clear interactions.</p>
        </Stage>
        <Stage index={3}>
          <small>YOUR NEXT PROJECT</small>
          <strong className="work-heading">
            Let’s build something useful.
          </strong>
          <p>Explore the case study, then start a conversation.</p>
          <span className="work-action">Get in touch ↗</span>
        </Stage>
      </div>
    </div>
  );
}
export default function ServiceIllustration({
  kind,
  caption,
}: {
  kind: string;
  caption: string;
}) {
  const flow = workflows[kind];
  const art =
    kind === "booking-systems" ? (
      <Booking />
    ) : kind === "admin-dashboard-development" ? (
      <Dashboard />
    ) : kind === "technical-seo" ? (
      <SEO />
    ) : kind === "crm-development" ? (
      <CRM />
    ) : kind === "cms-solutions" ? (
      <CMS />
    ) : kind === "custom-solutions" ? (
      <Applications />
    ) : kind === "portfolio-websites" ? (
      <Portfolio />
    ) : (
      <Website redesign={kind === "website-redesign"} />
    );
  const names: Record<string, string> = {
    "booking-systems": "Booking",
    "admin-dashboard-development": "Dashboard",
    "technical-seo": "Technical SEO",
    "crm-development": "CRM",
    "cms-solutions": "CMS",
    "custom-solutions": "Application",
    "portfolio-websites": "Portfolio",
    "business-websites": "Website",
    "website-redesign": "Redesign",
  };
  return (
    <figure
      className={"service-illustration workflow-illustration scene-" + kind}
      data-service-illustration={kind}
      data-stage-count={flow.length}
      aria-labelledby={"scene-caption-" + kind}
    >
      <div className="service-visual-art">
        <div className="illustration-frame workflow-frame" aria-hidden="true">
          <div className="illustration-chrome">
            <span className="window-dots" />
            <span>{names[kind] + " / workspace"}</span>
            {[
              "booking-systems",
              "admin-dashboard-development",
              "crm-development",
            ].includes(kind) && (
              <span className="scene-status">Sample data</span>
            )}
          </div>
          {art}
          <Steps items={flow} />
        </div>
        <ServiceWorkflowMotion name={names[kind]} />
      </div>
      <figcaption id={"scene-caption-" + kind} className="workflow-caption">
        {caption} Workflow: {flow.join(" → ")}.
      </figcaption>
    </figure>
  );
}
