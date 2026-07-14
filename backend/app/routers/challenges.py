from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.grading import grade_submission
from app.models import Challenge
from app.schemas import (
    ChallengeDetail,
    ChallengeSummary,
    HintRequest,
    HintResponse,
    SubmissionRequest,
    SubmissionResult,
)

router = APIRouter(prefix="/api/challenges", tags=["challenges"])


def _get_challenge_or_404(challenge_id: str, db: Session) -> Challenge:
    challenge = db.get(Challenge, challenge_id)
    if challenge is None:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


@router.get("", response_model=list[ChallengeSummary])
def list_challenges(db: Session = Depends(get_db)):
    return db.query(Challenge).all()


@router.get("/{challenge_id}", response_model=ChallengeDetail)
def get_challenge(challenge_id: str, db: Session = Depends(get_db)):
    challenge = _get_challenge_or_404(challenge_id, db)
    return ChallengeDetail(
        id=challenge.id,
        title=challenge.title,
        track=challenge.track,
        difficulty=challenge.difficulty,
        points=challenge.points,
        ticket=challenge.ticket,
        topology=challenge.topology,
        logs=challenge.logs,
        cli_outputs=challenge.cli_outputs,
        monitoring=challenge.monitoring,
        hint_count=len(challenge.hints),
    )


@router.post("/{challenge_id}/submit", response_model=SubmissionResult)
def submit_challenge(challenge_id: str, submission: SubmissionRequest, db: Session = Depends(get_db)):
    challenge = _get_challenge_or_404(challenge_id, db)
    correct, feedback = grade_submission(challenge, submission.root_cause, submission.fix)
    return SubmissionResult(
        correct=correct,
        feedback=feedback,
        points_awarded=challenge.points if correct else 0,
    )


@router.post("/{challenge_id}/hint", response_model=HintResponse)
def get_hint(challenge_id: str, request: HintRequest, db: Session = Depends(get_db)):
    challenge = _get_challenge_or_404(challenge_id, db)
    if not 0 <= request.hint_index < len(challenge.hints):
        raise HTTPException(status_code=400, detail="Invalid hint index")
    return HintResponse(
        hint=challenge.hints[request.hint_index],
        hint_index=request.hint_index,
        hints_remaining=len(challenge.hints) - request.hint_index - 1,
    )
