import { useEffect, useState } from "react";
import { fetchChallenges, type ChallengeSummary } from "../api/client";
import { ChallengeCard } from "../components/ChallengeCard";
import { TrackProgress } from "../components/TrackProgress";
import { isSolved } from "../lib/progress";

export function ChallengeListPage() {
  const [challenges, setChallenges] = useState<ChallengeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChallenges()
      .then(setChallenges)
      .catch(() => setError("Could not load challenges. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading challenges…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h1>Challenges</h1>
      <TrackProgress items={challenges} isSolved={isSolved} />
      <div className="challenge-grid">
        {challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
