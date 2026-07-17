import { useState } from "react";
import { fetchCodeOpsHint, submitCodeOpsChallenge, type CodeOpsSubmissionResult } from "../api/codeopsClient";
import { ResultFeedback } from "./ResultFeedback";

export function CodeOpsSubmissionForm({
  challengeId,
  questionType,
  choices,
  hintCount,
  onSolved,
}: {
  challengeId: string;
  questionType: "mcq" | "fill_blank";
  choices: string[];
  hintCount: number;
  onSolved: (points: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<CodeOpsSubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hints, setHints] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitCodeOpsChallenge(challengeId, answer);
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
    const res = await fetchCodeOpsHint(challengeId, hints.length);
    setHints((prev) => [...prev, res.hint]);
  };

  return (
    <section className="panel">
      <h2>Your Answer</h2>
      <form onSubmit={handleSubmit}>
        {questionType === "mcq" ? (
          <ul className="choice-list">
            {choices.map((choice, i) => (
              <li key={i}>
                <label className="choice-option">
                  <input
                    type="radio"
                    name="choice"
                    value={choice}
                    checked={answer === choice}
                    onChange={(e) => setAnswer(e.target.value)}
                    required
                  />
                  <pre>{choice}</pre>
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <label>
            Answer
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Fill in the missing code"
              required
            />
          </label>
        )}
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
