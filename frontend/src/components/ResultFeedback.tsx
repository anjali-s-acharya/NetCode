import type { SubmissionResult } from "../api/client";

export function ResultFeedback({ result }: { result: SubmissionResult }) {
  return (
    <div className={`result-feedback ${result.correct ? "correct" : "incorrect"}`}>
      <p className="result-headline">
        {result.correct ? `Correct! +${result.points_awarded} points` : "Not quite right"}
      </p>
      <p>{result.feedback}</p>
    </div>
  );
}
