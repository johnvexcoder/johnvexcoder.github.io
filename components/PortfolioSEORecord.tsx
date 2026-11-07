export default function PortfolioSEORecord({
  record,
}: {
  record: {
    label: string;
    heading: string;
    problem: string;
    baseline: string;
    actions: string[];
    results: string[][];
    limits: string;
  };
}) {
  return (
    <section
      id="portfolio-evidence"
      className="portfolio-seo-record"
      aria-labelledby="portfolio-evidence-heading"
    >
      <p className="eyebrow">{record.label}</p>
      <h2 id="portfolio-evidence-heading">{record.heading}</h2>
      <p>{record.problem}</p>
      <p>{record.baseline}</p>
      <ol>
        {record.actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ol>
      <div className="verification-grid">
        {record.results.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p>{record.limits}</p>
    </section>
  );
}
