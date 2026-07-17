import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchLesson, type LessonDetail } from "../api/lessonsClient";
import { LessonContentPanel } from "../components/LessonContentPanel";
import { LessonSubmissionForm } from "../components/LessonSubmissionForm";
import { markLessonSolved } from "../lib/lessonProgress";

export function LessonDetailPage() {
  const { category, lessonId } = useParams<{ category: string; lessonId: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    fetchLesson(lessonId)
      .then(setLesson)
      .catch(() => setError("Could not load this lesson."));
  }, [lessonId]);

  if (error) return <p className="error">{error}</p>;
  if (!lesson) return <p>Loading lesson…</p>;

  return (
    <div>
      <Link to={`/learn/${category}`} className="back-link">
        ← All lessons
      </Link>
      <div className="challenge-detail-header">
        <h1>{lesson.title}</h1>
        <span className="badge track">{lesson.track}</span>
      </div>

      <LessonContentPanel content={lesson.content} />
      <LessonSubmissionForm
        lessonId={lesson.id}
        questionType={lesson.question_type}
        choices={lesson.choices}
        checkStatement={lesson.check.statement}
        onSolved={() => markLessonSolved(lesson.id, lesson.points)}
      />
    </div>
  );
}
