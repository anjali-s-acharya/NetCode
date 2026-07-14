import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchChallenge, type ChallengeDetail } from "../api/client";
import { TicketPanel } from "../components/TicketPanel";
import { TopologyPanel } from "../components/TopologyPanel";
import { LogsPanel } from "../components/LogsPanel";
import { CliOutputPanel } from "../components/CliOutputPanel";
import { MonitoringPanel } from "../components/MonitoringPanel";
import { SubmissionForm } from "../components/SubmissionForm";
import { markSolved } from "../lib/progress";

export function ChallengeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchChallenge(id)
      .then(setChallenge)
      .catch(() => setError("Could not load this challenge."));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!challenge) return <p>Loading challenge…</p>;

  return (
    <div>
      <Link to="/" className="back-link">
        ← All challenges
      </Link>
      <div className="challenge-detail-header">
        <h1>{challenge.title}</h1>
        <span className={`badge difficulty-${challenge.difficulty.toLowerCase()}`}>
          {challenge.difficulty}
        </span>
        <span className="badge track">{challenge.track}</span>
      </div>

      <TicketPanel ticket={challenge.ticket} />
      <TopologyPanel topology={challenge.topology} />
      <LogsPanel logs={challenge.logs} />
      <CliOutputPanel cliOutputs={challenge.cli_outputs} />
      <MonitoringPanel monitoring={challenge.monitoring} />
      <SubmissionForm
        challengeId={challenge.id}
        hintCount={challenge.hint_count}
        onSolved={() => markSolved(challenge.id, challenge.points)}
      />
    </div>
  );
}
