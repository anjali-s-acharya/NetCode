import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLessons, type LessonSummary } from "../api/lessonsClient";
import { isLessonSolved } from "../lib/lessonProgress";
import { LessonCard } from "../components/LessonCard";

const CATEGORY_TITLES: Record<string, string> = {
  networking: "Networking Basics",
  coding: "Coding Basics",
};

export function LessonListPage() {
  const { category } = useParams<{ category: string }>();
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) return;
    fetchLessons(category)
      .then(setLessons)
      .catch(() => setError("Could not load lessons. Is the backend running?"))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return <p>Loading lessons…</p>;
  if (error) return <p className="error">{error}</p>;

  const tracks = [...new Set(lessons.map((l) => l.track))];

  return (
    <div>
      <Link to="/" className="back-link">
        ← Home
      </Link>
      <h1>{CATEGORY_TITLES[category ?? ""] ?? "Lessons"}</h1>
      {tracks.map((track) => {
        const trackLessons = lessons
          .filter((l) => l.track === track)
          .sort((a, b) => a.order - b.order);

        return (
          <section key={track} className="lesson-track-section">
            <h2>{track}</h2>
            <div className="challenge-grid">
              {trackLessons.map((lesson, i) => {
                const previous = trackLessons[i - 1];
                const locked = previous ? !isLessonSolved(previous.id) : false;
                return <LessonCard key={lesson.id} lesson={lesson} locked={locked} />;
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
