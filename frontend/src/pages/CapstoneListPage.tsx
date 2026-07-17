import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCapstones, type CapstoneSummary } from "../api/capstonesClient";
import { solvedStageCount } from "../lib/capstoneProgress";

export function CapstoneListPage() {
  const [capstones, setCapstones] = useState<CapstoneSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCapstones()
      .then(setCapstones)
      .catch(() => setError("Could not load capstones. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading capstones…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Home
      </Link>
      <h1>Capstone Labs</h1>
      <p className="home-subtitle">
        Full-incident labs: diagnose the outage, write the automation fix, then add the guardrail
        that prevents it from happening again.
      </p>
      <div className="challenge-grid">
        {capstones.map((c) => {
          const done = solvedStageCount(c.id);
          const complete = done >= c.stage_count;
          return (
            <Link
              key={c.id}
              to={`/capstones/${c.id}`}
              className={`challenge-card ${complete ? "solved" : ""}`}
            >
              <div className="challenge-card-header">
                <span className="badge track">{c.track}</span>
                {complete && <span className="badge solved-badge">✓ Complete</span>}
              </div>
              <h3>{c.title}</h3>
              <p className="points">
                {c.points_total} pts · stage {Math.min(done + 1, c.stage_count)}/{c.stage_count}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
