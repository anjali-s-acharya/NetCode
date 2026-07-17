import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { PracticePage } from "./pages/PracticePage";
import { ChallengeListPage } from "./pages/ChallengeListPage";
import { ChallengeDetailPage } from "./pages/ChallengeDetailPage";
import { CodeOpsListPage } from "./pages/CodeOpsListPage";
import { CodeOpsChallengeDetailPage } from "./pages/CodeOpsChallengeDetailPage";
import { LessonListPage } from "./pages/LessonListPage";
import { LessonDetailPage } from "./pages/LessonDetailPage";
import { CapstoneListPage } from "./pages/CapstoneListPage";
import { CapstoneDetailPage } from "./pages/CapstoneDetailPage";
import { getProgress, PROGRESS_UPDATED_EVENT } from "./lib/progress";
import { getCodeOpsProgress, CODEOPS_PROGRESS_UPDATED_EVENT } from "./lib/codeopsProgress";
import { getLessonProgress, LESSONS_PROGRESS_UPDATED_EVENT } from "./lib/lessonProgress";
import { getCapstoneProgress, CAPSTONE_PROGRESS_UPDATED_EVENT } from "./lib/capstoneProgress";
import { getStreak, STREAK_UPDATED_EVENT } from "./lib/streak";
import { levelProgress } from "./lib/gamify";
import "./App.css";

function totalXp(): number {
  return (
    getProgress().totalPoints +
    getCodeOpsProgress().totalPoints +
    getLessonProgress().totalPoints +
    getCapstoneProgress().totalPoints
  );
}

const PROGRESS_EVENTS = [
  PROGRESS_UPDATED_EVENT,
  CODEOPS_PROGRESS_UPDATED_EVENT,
  LESSONS_PROGRESS_UPDATED_EVENT,
  CAPSTONE_PROGRESS_UPDATED_EVENT,
  STREAK_UPDATED_EVENT,
];

function App() {
  const [xp, setXp] = useState(totalXp);
  const [streak, setStreak] = useState(getStreak);

  useEffect(() => {
    const onUpdate = () => {
      setXp(totalXp());
      setStreak(getStreak());
    };
    PROGRESS_EVENTS.forEach((e) => window.addEventListener(e, onUpdate));
    return () => PROGRESS_EVENTS.forEach((e) => window.removeEventListener(e, onUpdate));
  }, []);

  const lvl = levelProgress(xp);

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="logo">
          NetCode
        </Link>
        <div className="header-stats">
          {streak > 0 && <span className="streak-pill" title="Daily streak">🔥 {streak}</span>}
          <span className="level-pill" title={lvl.title}>
            Lv {lvl.level} · {lvl.title}
          </span>
          <span className="points-total">{xp} XP</span>
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/netcode" element={<ChallengeListPage />} />
          <Route path="/netcode/challenges/:id" element={<ChallengeDetailPage />} />
          <Route path="/codeops" element={<CodeOpsListPage />} />
          <Route path="/codeops/challenges/:id" element={<CodeOpsChallengeDetailPage />} />
          <Route path="/learn/:category" element={<LessonListPage />} />
          <Route path="/learn/:category/:lessonId" element={<LessonDetailPage />} />
          <Route path="/capstones" element={<CapstoneListPage />} />
          <Route path="/capstones/:id" element={<CapstoneDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
