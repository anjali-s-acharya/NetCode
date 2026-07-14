from pydantic import BaseModel, ConfigDict


class ChallengeSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    track: str
    difficulty: str
    points: int


class ChallengeDetail(ChallengeSummary):
    ticket: dict
    topology: dict
    logs: list
    cli_outputs: list
    monitoring: dict
    hint_count: int


class SubmissionRequest(BaseModel):
    root_cause: str
    fix: str


class SubmissionResult(BaseModel):
    correct: bool
    feedback: str
    points_awarded: int


class HintRequest(BaseModel):
    hint_index: int


class HintResponse(BaseModel):
    hint: str
    hint_index: int
    hints_remaining: int
