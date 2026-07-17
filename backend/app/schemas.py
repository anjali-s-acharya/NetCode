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


class CodeOpsChallengeSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    track: str
    difficulty: str
    points: int


class CodeOpsChallengeDetail(CodeOpsChallengeSummary):
    question_type: str
    choices: list
    problem: dict
    hint_count: int


class CodeOpsSubmissionRequest(BaseModel):
    answer: str


class CodeOpsSubmissionResult(BaseModel):
    correct: bool
    feedback: str
    points_awarded: int


class LessonSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    category: str
    track: str
    order: int
    points: int


class LessonDetail(LessonSummary):
    question_type: str
    choices: list
    content: dict
    check: dict


class LessonSubmissionRequest(BaseModel):
    answer: str


class LessonSubmissionResult(BaseModel):
    correct: bool
    feedback: str
    points_awarded: int


class CapstoneSummary(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    track: str
    points_total: int
    stage_count: int


class CapstoneStagePublic(BaseModel):
    title: str
    stage_type: str
    question_type: str
    points: int
    context: dict
    choices: list


class CapstoneDetail(BaseModel):
    id: str
    title: str
    track: str
    points_total: int
    stages: list[CapstoneStagePublic]


class CapstoneStageSubmission(BaseModel):
    answer: str


class CapstoneStageResult(BaseModel):
    correct: bool
    feedback: str
    points_awarded: int
