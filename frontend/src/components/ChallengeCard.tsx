import { Link } from "react-router-dom";
import type { ChallengeSummary } from "../api/client";
import { isSolved } from "../lib/progress";

export function ChallengeCard({ challenge }: { challenge: ChallengeSummary }) {
  const solved = isSolved(challenge.id);

  return (
    <Link to={`/challenges/${challenge.id}`} className={`challenge-card ${solved ? "solved" : ""}`}>
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
