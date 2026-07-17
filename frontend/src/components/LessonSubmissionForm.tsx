import { useState } from "react";
import { submitLesson, type LessonSubmissionResult } from "../api/lessonsClient";
import { ResultFeedback } from "./ResultFeedback";

export function LessonSubmissionForm({
  lessonId,
  questionType,
  choices,
  checkStatement,
  onSolved,
}: {
  lessonId: string;
  questionType: "mcq" | "fill_blank";
  choices: string[];
  checkStatement: string;
  onSolved: (points: number) => void;
}) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<LessonSubmissionResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await submitLesson(lessonId, answer);
      setResult(res);
      if (res.correct) {
        onSolved(res.points_awarded);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="panel">
      <h2>Quick Check</h2>
      <p>{checkStatement}</p>
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
              placeholder="Type your answer"
              required
            />
          </label>
        )}
        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Grading..." : "Submit"}
          </button>
        </div>
      </form>

      {result && <ResultFeedback result={result} />}
    </section>
  );
}
