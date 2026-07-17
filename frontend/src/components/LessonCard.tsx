import { Link } from "react-router-dom";
import type { LessonSummary } from "../api/lessonsClient";
import { isLessonSolved } from "../lib/lessonProgress";

export function LessonCard({ lesson, locked }: { lesson: LessonSummary; locked: boolean }) {
  const solved = isLessonSolved(lesson.id);

  const body = (
    <>
      <div className="challenge-card-header">
        <span className="badge track">{lesson.track}</span>
        {solved && <span className="badge solved-badge">✓ Solved</span>}
        {locked && <span className="badge locked-badge">🔒 Locked</span>}
      </div>
      <h3>{lesson.title}</h3>
      <p className="points">{lesson.points} pts</p>
    </>
  );

  if (locked) {
    return <div className="challenge-card lesson-card locked">{body}</div>;
  }

  return (
    <Link to={`/learn/${lesson.category}/${lesson.id}`} className={`challenge-card lesson-card ${solved ? "solved" : ""}`}>
      {body}
    </Link>
  );
}
