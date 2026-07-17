import type { SubmissionResult } from "../api/client";

const CONFETTI_PIECES = 14;

export function ResultFeedback({ result }: { result: SubmissionResult }) {
  return (
    <div className={`result-feedback ${result.correct ? "correct celebrate" : "incorrect"}`}>
      {result.correct && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: CONFETTI_PIECES }, (_, i) => (
            <span key={i} className={`confetti-piece p${i % 7}`} style={{ left: `${(i * 100) / CONFETTI_PIECES}%` }} />
          ))}
        </div>
      )}
      <p className="result-headline">
        {result.correct ? `Correct! +${result.points_awarded} points` : "Not quite right"}
      </p>
      <p>{result.feedback}</p>
    </div>
  );
}
