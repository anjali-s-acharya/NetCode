from app.matching import answers_match
from app.models import Challenge


def grade_submission(challenge: Challenge, root_cause: str, fix: str) -> tuple[bool, str]:
    submitted = f"{root_cause} {fix}"
    acceptable_answers = challenge.solution.get("acceptable_answers", [])
    min_matches = challenge.solution.get("min_matches", 1)

    matched = answers_match(acceptable_answers, submitted, min_matches)

    if matched:
        feedback = f"Correct! Root cause: {challenge.solution['root_cause']} Fix: {challenge.solution['fix']}"
    else:
        feedback = (
            "Not quite. Re-check the logs and CLI output for the device(s) closest to "
            "the reported symptom, then try again."
        )

    return matched, feedback
