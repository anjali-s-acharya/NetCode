from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.lesson_grading import grade_lesson_submission
from app.models import Lesson
from app.schemas import (
    LessonDetail,
    LessonSubmissionRequest,
    LessonSubmissionResult,
    LessonSummary,
)

router = APIRouter(prefix="/api/lessons", tags=["lessons"])


def _get_lesson_or_404(lesson_id: str, db: Session) -> Lesson:
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@router.get("", response_model=list[LessonSummary])
def list_lessons(category: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Lesson)
    if category:
        query = query.filter(Lesson.category == category)
    return query.order_by(Lesson.track, Lesson.order).all()


@router.get("/{lesson_id}", response_model=LessonDetail)
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    lesson = _get_lesson_or_404(lesson_id, db)
    return LessonDetail(
        id=lesson.id,
        title=lesson.title,
        category=lesson.category,
        track=lesson.track,
        order=lesson.order,
        points=lesson.points,
        question_type=lesson.question_type,
        choices=lesson.choices,
        content=lesson.content,
        check=lesson.check,
    )


@router.post("/{lesson_id}/submit", response_model=LessonSubmissionResult)
def submit_lesson(lesson_id: str, submission: LessonSubmissionRequest, db: Session = Depends(get_db)):
    lesson = _get_lesson_or_404(lesson_id, db)
    correct, feedback = grade_lesson_submission(lesson, submission.answer)
    return LessonSubmissionResult(
        correct=correct,
        feedback=feedback,
        points_awarded=lesson.points if correct else 0,
    )
