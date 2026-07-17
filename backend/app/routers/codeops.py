from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.codeops_grading import grade_codeops_submission
from app.database import get_db
from app.models import CodeOpsChallenge
from app.schemas import (
    CodeOpsChallengeDetail,
    CodeOpsChallengeSummary,
    CodeOpsSubmissionRequest,
    CodeOpsSubmissionResult,
    HintRequest,
    HintResponse,
)

router = APIRouter(prefix="/api/codeops", tags=["codeops"])


def _get_challenge_or_404(challenge_id: str, db: Session) -> CodeOpsChallenge:
    challenge = db.get(CodeOpsChallenge, challenge_id)
    if challenge is None:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


@router.get("", response_model=list[CodeOpsChallengeSummary])
def list_codeops_challenges(db: Session = Depends(get_db)):
    return db.query(CodeOpsChallenge).all()


@router.get("/{challenge_id}", response_model=CodeOpsChallengeDetail)
def get_codeops_challenge(challenge_id: str, db: Session = Depends(get_db)):
    challenge = _get_challenge_or_404(challenge_id, db)
    return CodeOpsChallengeDetail(
        id=challenge.id,
        title=challenge.title,
        track=challenge.track,
        difficulty=challenge.difficulty,
        points=challenge.points,
        question_type=challenge.question_type,
        choices=challenge.choices,
        problem=challenge.problem,
        hint_count=len(challenge.hints),
    )


@router.post("/{challenge_id}/submit", response_model=CodeOpsSubmissionResult)
def submit_codeops_challenge(
    challenge_id: str, submission: CodeOpsSubmissionRequest, db: Session = Depends(get_db)
):
    challenge = _get_challenge_or_404(challenge_id, db)
    correct, feedback = grade_codeops_submission(challenge, submission.answer)
    return CodeOpsSubmissionResult(
        correct=correct,
        feedback=feedback,
        points_awarded=challenge.points if correct else 0,
    )


@router.post("/{challenge_id}/hint", response_model=HintResponse)
def get_codeops_hint(challenge_id: str, request: HintRequest, db: Session = Depends(get_db)):
    challenge = _get_challenge_or_404(challenge_id, db)
    if not 0 <= request.hint_index < len(challenge.hints):
        raise HTTPException(status_code=400, detail="Invalid hint index")
    return HintResponse(
        hint=challenge.hints[request.hint_index],
        hint_index=request.hint_index,
        hints_remaining=len(challenge.hints) - request.hint_index - 1,
    )
