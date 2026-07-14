import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { ChallengeListPage } from "./pages/ChallengeListPage";
import { ChallengeDetailPage } from "./pages/ChallengeDetailPage";
import { getProgress, PROGRESS_UPDATED_EVENT } from "./lib/progress";
import "./App.css";

function App() {
  const [totalPoints, setTotalPoints] = useState(() => getProgress().totalPoints);

  useEffect(() => {
    const onProgressUpdated = () => setTotalPoints(getProgress().totalPoints);
    window.addEventListener(PROGRESS_UPDATED_EVENT, onProgressUpdated);
    return () => window.removeEventListener(PROGRESS_UPDATED_EVENT, onProgressUpdated);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="logo">
          NetCode
        </Link>
        <span className="points-total">{totalPoints} pts</span>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ChallengeListPage />} />
          <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
