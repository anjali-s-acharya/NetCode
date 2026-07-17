import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchChallenges } from "../api/client";
import { fetchCodeOpsChallenges } from "../api/codeopsClient";
import { getProgress } from "../lib/progress";
import { getCodeOpsProgress } from "../lib/codeopsProgress";
import { getLessonProgress } from "../lib/lessonProgress";
import { getCapstoneProgress } from "../lib/capstoneProgress";
import { getStreak } from "../lib/streak";
import { levelProgress } from "../lib/gamify";
import { pickDaily, type DailyPick } from "../lib/daily";

export function HomePage() {
  const [daily, setDaily] = useState<DailyPick | null>(null);

  useEffect(() => {
    Promise.all([fetchChallenges(), fetchCodeOpsChallenges()])
      .then(([netcode, codeops]) => setDaily(pickDaily(netcode, codeops)))
      .catch(() => setDaily(null));
  }, []);

  const netcodeProgress = getProgress();
  const codeopsProgress = getCodeOpsProgress();
  const xp =
    netcodeProgress.totalPoints +
    codeopsProgress.totalPoints +
    getLessonProgress().totalPoints +
    getCapstoneProgress().totalPoints;
  const solvedCount =
    netcodeProgress.solvedIds.length +
    codeopsProgress.solvedIds.length +
    getLessonProgress().solvedIds.length;
  const streak = getStreak();
  const lvl = levelProgress(xp);
  const dailySolved =
    daily !== null &&
    (netcodeProgress.solvedIds.includes(daily.id) || codeopsProgress.solvedIds.includes(daily.id));

  return (
    <div className="home-hero">
      <div className="stats-strip">
        <div className="stat">
          <span className="stat-value">Lv {lvl.level}</span>
          <span className="stat-label">{lvl.title}</span>
          <div className="level-bar">
            <div className="level-bar-fill" style={{ width: `${lvl.pct}%` }} />
          </div>
        </div>
        <div className="stat">
          <span className="stat-value">{xp}</span>
          <span className="stat-label">XP</span>
        </div>
        <div className="stat">
          <span className="stat-value">🔥 {streak}</span>
          <span className="stat-label">day streak</span>
        </div>
        <div className="stat">
          <span className="stat-value">{solvedCount}</span>
          <span className="stat-label">solved</span>
        </div>
      </div>

      {daily && (
        <Link to={daily.path} className={`daily-banner ${dailySolved ? "done" : ""}`}>
          <span className="daily-label">⚡ Today's challenge</span>
          <span className="daily-title">{daily.title}</span>
          <span className="daily-cta">{dailySolved ? "✓ Solved today" : "Solve it →"}</span>
        </Link>
      )}

      <h1>Pick a track</h1>
      <p className="home-subtitle">
        Learn from scratch, or jump straight into practice.
      </p>
      <div className="track-picker">
        <Link to="/learn/networking" className="track-card">
          <h2>Networking Basics</h2>
          <p>
            New to networking? Start here — short guided lessons covering DNS, DHCP, Routing,
            and Switching fundamentals, one small concept at a time.
          </p>
        </Link>
        <Link to="/learn/coding" className="track-card">
          <h2>Coding Basics</h2>
          <p>
            Never written code before? Learn the essentials of Python, REST APIs, and Git &amp;
            GitHub through short guided lessons built for network engineers.
          </p>
        </Link>
        <Link to="/practice" className="track-card">
          <h2>Practice</h2>
          <p>
            Already comfortable with the basics? Sharpen your skills with NetCode troubleshooting
            tickets and CodeOps automation challenges.
          </p>
        </Link>
        <Link to="/capstones" className="track-card capstone-card">
          <h2>Capstone Labs</h2>
          <p>
            The full incident lifecycle: diagnose a real outage, write the automation fix, then
            add the guardrail that stops it from ever happening again.
          </p>
        </Link>
      </div>
    </div>
  );
}
