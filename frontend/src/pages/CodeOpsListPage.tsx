import { useEffect, useState } from "react";
import { fetchCodeOpsChallenges, type CodeOpsChallengeSummary } from "../api/codeopsClient";
import { CodeOpsChallengeCard } from "../components/CodeOpsChallengeCard";
import { TrackProgress } from "../components/TrackProgress";
import { isCodeOpsSolved } from "../lib/codeopsProgress";

export function CodeOpsListPage() {
  const [challenges, setChallenges] = useState<CodeOpsChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCodeOpsChallenges()
      .then(setChallenges)
      .catch(() => setError("Could not load challenges. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading challenges…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>CodeOps Challenges</h1>
      <TrackProgress items={challenges} isSolved={isCodeOpsSolved} />
      <div className="challenge-grid">
        {challenges.map((challenge) => (
          <CodeOpsChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
