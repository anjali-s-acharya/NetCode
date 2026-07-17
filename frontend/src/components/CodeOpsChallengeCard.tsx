import { Link } from "react-router-dom";
import type { CodeOpsChallengeSummary } from "../api/codeopsClient";
import { isCodeOpsSolved } from "../lib/codeopsProgress";

export function CodeOpsChallengeCard({ challenge }: { challenge: CodeOpsChallengeSummary }) {
  const solved = isCodeOpsSolved(challenge.id);

  return (
    <Link to={`/codeops/challenges/${challenge.id}`} className={`challenge-card ${solved ? "solved" : ""}`}>
      <div className="challenge-card-header">
        <span className={`badge difficulty-${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
        <span className="badge track">{challenge.track}</span>
        {solved && <span className="badge solved-badge">✓ Solved</span>}
      </div>
      <h3>{challenge.title}</h3>
      <p className="points">{challenge.points} pts</p>
    </Link>
  );
}
