import { ChevronDown } from "lucide-react";
import learningHistory from "@/content/learning-history.json";

export default function LearningHistory() {
  return (
    <section className="learning-history" aria-labelledby="learning-heading">
      <h3 id="learning-heading" className="learning-heading">
        Continuous Learning
      </h3>
      <p className="learning-intro">
        Technical courses and self-directed training supporting my development
        practice.
      </p>
      <details className="learning-panel">
        <summary className="learning-summary">
          <span className="learning-summary-copy">
            <span className="learning-panel-title">
              Technical Training &amp; Skills
            </span>
            <span className="learning-panel-count">
              {learningHistory.length} learning experiences · 2020–2026
            </span>
          </span>
          <span className="learning-toggle">
            <span>
              <span className="learning-view">View Learning &amp; Skills</span>
              <span className="learning-hide">Hide Learning &amp; Skills</span>
            </span>
            <ChevronDown size={16} aria-hidden="true" />
          </span>
        </summary>
        <div className="learning-panel-body">
          <div className="learning-columns" aria-hidden="true">
            <span>Period</span>
            <span>Provider</span>
            <span>Learning Focus</span>
            <span>Skills</span>
          </div>
          <ol className="learning-records" role="list">
            {learningHistory.map((record) => (
              <li key={record.period} className="learning-record">
                <p className="learning-provider">{record.provider}</p>
                <p className="learning-period">{record.period}</p>
                <div className="learning-focus">
                  <h4>{record.focus}</h4>
                  <p>{record.category}</p>
                </div>
                <p className="learning-description">{record.description}</p>
                <ul className="learning-skills" role="list" aria-label="Skills">
                  {record.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </details>
    </section>
  );
}
