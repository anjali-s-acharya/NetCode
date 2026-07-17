import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCodeOpsChallenge, type CodeOpsChallengeDetail } from "../api/codeopsClient";
import { ProblemPanel } from "../components/ProblemPanel";
import { CodeOpsSubmissionForm } from "../components/CodeOpsSubmissionForm";
import { markCodeOpsSolved } from "../lib/codeopsProgress";

export function CodeOpsChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<CodeOpsChallengeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchCodeOpsChallenge(id)
      .then(setChallenge)
      .catch(() => setError("Could not load this challenge."));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!challenge) return <p>Loading challenge…</p>;

  return (
    <div>
      <Link to="/codeops" className="back-link">
        ← All challenges
      </Link>
      <div className="challenge-detail-header">
        <h1>{challenge.title}</h1>
        <span className={`badge difficulty-${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
        <span className="badge track">{challenge.track}</span>
      </div>

      <ProblemPanel problem={challenge.problem} />
      <CodeOpsSubmissionForm
        challengeId={challenge.id}
        questionType={challenge.question_type}
        choices={challenge.choices}
        hintCount={challenge.hint_count}
        onSolved={() => markCodeOpsSolved(challenge.id, challenge.points)}
      />
    </div>
  );
}
