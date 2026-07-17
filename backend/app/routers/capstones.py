from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.capstone_grading import grade_capstone_stage
from app.database import get_db
from app.models import Capstone
from app.schemas import (
    CapstoneDetail,
    CapstoneStagePublic,
    CapstoneStageResult,
    CapstoneStageSubmission,
    CapstoneSummary,
)

router = APIRouter(prefix="/api/capstones", tags=["capstones"])


def _get_capstone_or_404(capstone_id: str, db: Session) -> Capstone:
    capstone = db.get(Capstone, capstone_id)
    if capstone is None:
        raise HTTPException(status_code=404, detail="Capstone not found")
    return capstone


def _stage_public(stage: dict) -> CapstoneStagePublic:
    return CapstoneStagePublic(
        title=stage["title"],
        stage_type=stage["stage_type"],
        question_type=stage["question_type"],
        points=stage["points"],
        context=stage["context"],
        choices=stage.get("choices", []),
    )


@router.get("", response_model=list[CapstoneSummary])
def list_capstones(db: Session = Depends(get_db)):
    return [
        CapstoneSummary(
            id=c.id,
            title=c.title,
            track=c.track,
            points_total=c.points_total,
            stage_count=len(c.stages),
        )
        for c in db.query(Capstone).all()
    ]


@router.get("/{capstone_id}", response_model=CapstoneDetail)
def get_capstone(capstone_id: str, db: Session = Depends(get_db)):
    capstone = _get_capstone_or_404(capstone_id, db)
    return CapstoneDetail(
        id=capstone.id,
        title=capstone.title,
        track=capstone.track,
        points_total=capstone.points_total,
        stages=[_stage_public(s) for s in capstone.stages],
    )


@router.post("/{capstone_id}/stages/{stage_index}/submit", response_model=CapstoneStageResult)
def submit_capstone_stage(
    capstone_id: str,
    stage_index: int,
    submission: CapstoneStageSubmission,
    db: Session = Depends(get_db),
):
    capstone = _get_capstone_or_404(capstone_id, db)
    if not 0 <= stage_index < len(capstone.stages):
        raise HTTPException(status_code=400, detail="Invalid stage index")
    stage = capstone.stages[stage_index]
    correct, feedback = grade_capstone_stage(stage, submission.answer)
    return CapstoneStageResult(
        correct=correct,
        feedback=feedback,
        points_awarded=stage["points"] if correct else 0,
    )
