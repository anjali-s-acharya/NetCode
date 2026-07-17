import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCapstone, type CapstoneDetail } from "../api/capstonesClient";
import { CapstoneStageForm } from "../components/CapstoneStageForm";
import { isStageSolved, markStageSolved } from "../lib/capstoneProgress";

export function CapstoneDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [capstone, setCapstone] = useState<CapstoneDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setTick] = useState(0); // re-render after a stage is solved

  useEffect(() => {
    if (!id) return;
    fetchCapstone(id)
      .then(setCapstone)
      .catch(() => setError("Could not load this capstone."));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!capstone) return <p>Loading capstone…</p>;

  const solved = capstone.stages.map((_, i) => isStageSolved(capstone.id, i));
  const allDone = solved.every(Boolean);

  return (
    <div>
      <Link to="/capstones" className="back-link">
        ← All capstones
      </Link>
      <div className="challenge-detail-header">
        <h1>{capstone.title}</h1>
        <span className="badge track">{capstone.track}</span>
      </div>

      <div className="capstone-stepper">
        {capstone.stages.map((stage, i) => (
          <span
            key={i}
            className={`capstone-step ${solved[i] ? "done" : ""} ${
              !solved[i] && (i === 0 || solved[i - 1]) ? "active" : ""
            }`}
          >
            {solved[i] ? "✓" : i + 1} {stage.stage_type}
          </span>
        ))}
      </div>

      {allDone && (
        <div className="result-feedback correct">
          <p className="result-headline">🏆 Capstone complete! +{capstone.points_total} pts total</p>
          <p>You diagnosed the outage, fixed the automation, and added the guardrail.</p>
        </div>
      )}

      {capstone.stages.map((stage, i) => {
        const unlocked = i === 0 || solved[i - 1];
        if (!unlocked) {
          return (
            <section key={i} className="panel capstone-stage locked">
              <h2>🔒 {stage.title}</h2>
              <p>Complete the previous stage to unlock.</p>
            </section>
          );
        }
        return (
          <section key={i} className="panel capstone-stage">
            <h2>
              {stage.title} {solved[i] && <span className="badge solved-badge">✓ Solved</span>}
            </h2>
            <p>{stage.context.narrative}</p>
            {stage.context.artifacts.map((a, j) => (
              <div key={j} className="cli-block">
                <p className="cli-command">{a.label}</p>
                <pre>{a.content}</pre>
              </div>
            ))}
            <CapstoneStageForm
              capstoneId={capstone.id}
              stageIndex={i}
              stage={stage}
              alreadySolved={solved[i]}
              onSolved={(points) => {
                markStageSolved(capstone.id, i, points);
                setTick((t) => t + 1);
              }}
            />
          </section>
        );
      })}
    </div>
  );
}
