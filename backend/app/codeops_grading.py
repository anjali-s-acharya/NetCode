from app.matching import answers_match
from app.models import CodeOpsChallenge


def grade_codeops_submission(challenge: CodeOpsChallenge, answer: str) -> tuple[bool, str]:
    submitted = answer.strip().lower()
    acceptable_answers = challenge.solution.get("acceptable_answers", [])
    min_matches = challenge.solution.get("min_matches", 1)

    if challenge.question_type == "mcq":
        flat = [
            p.lower()
            for entry in acceptable_answers
            for p in (entry if isinstance(entry, list) else [entry])
        ]
        matched = submitted in flat
    else:
        matched = answers_match(acceptable_answers, answer, min_matches, bidirectional=True)

    if matched:
        feedback = f"Correct! {challenge.solution['explanation']}"
    else:
        feedback = "Not quite. Re-read the problem statement and try again."

    return matched, feedback
