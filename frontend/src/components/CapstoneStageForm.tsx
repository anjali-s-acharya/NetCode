import { useState } from "react";
import { submitCapstoneStage, type CapstoneStage, type CapstoneStageResult } from "../api/capstonesClient";
import { ResultFeedback } from "./ResultFeedback";

export function CapstoneStageForm({
  capstoneId,
  stageIndex,
  stage,
  alreadySolved,
  onSolved,
}: {
  capstoneId: string;
  stageIndex: number;
  stage: CapstoneStage;
  alreadySolved: boolean;
  onSolved: (points: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<CapstoneStageResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Solved in a previous session: nothing to show (the header badge marks it done).
  if (alreadySolved && !result) return null;

  // Just solved: keep the feedback (and confetti) visible, hide the inputs.
  if (result?.correct) return <ResultFeedback result={result} />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitCapstoneStage(capstoneId, stageIndex, answer);
      setResult(res);
      if (res.correct) {
        onSolved(res.points_awarded);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {stage.question_type === "mcq" ? (
        <ul className="choice-list">
          {stage.choices.map((choice, i) => (
            <li key={i}>
              <label className="choice-option">
                <input
                  type="radio"
                  name={`choice-${stageIndex}`}
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
          {stage.question_type === "free_text" ? "Your diagnosis" : "Your answer"}
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              stage.question_type === "free_text"
                ? "Root cause and immediate fix"
                : "Fill in the missing code/config"
            }
            required
          />
        </label>
      )}
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Grading..." : "Submit"}
        </button>
      </div>

      {result && <ResultFeedback result={result} />}
    </form>
  );
}
