import { useState } from "react";
import { fetchHint, submitChallenge, type SubmissionResult } from "../api/client";
import { ResultFeedback } from "./ResultFeedback";

export function SubmissionForm({
  challengeId,
  hintCount,
  onSolved,
}: {
  challengeId: string;
  hintCount: number;
  onSolved: (points: number) => void;
}) {
  const [rootCause, setRootCause] = useState("");
  const [fix, setFix] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hints, setHints] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitChallenge(challengeId, rootCause, fix);
      setResult(res);
      if (res.correct) {
        onSolved(res.points_awarded);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleHint = async () => {
    if (hints.length >= hintCount) return;
    const res = await fetchHint(challengeId, hints.length);
    setHints((prev) => [...prev, res.hint]);
  };

  return (
    <section className="panel">
      <h2>Your Diagnosis</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Root cause
          <textarea
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            placeholder="What is causing this issue?"
            required
          />
        </label>
        <label>
          Fix
          <textarea
            value={fix}
            onChange={(e) => setFix(e.target.value)}
            placeholder="What would you change to resolve it?"
            required
          />
        </label>
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Grading..." : "Submit"}
          </button>
          <button type="button" onClick={handleHint} disabled={hints.length >= hintCount}>
            Get Hint ({hints.length}/{hintCount})
          </button>
        </div>
      </form>

      {hints.length > 0 && (
        <ul className="hints-list">
          {hints.map((hint, i) => (
            <li key={i}>{hint}</li>
          ))}
        </ul>
      )}

      {result && <ResultFeedback result={result} />}
    </section>
  );
}
