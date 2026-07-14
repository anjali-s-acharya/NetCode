from app.models import Challenge


def grade_submission(challenge: Challenge, root_cause: str, fix: str) -> tuple[bool, str]:
    submitted = f"{root_cause} {fix}".lower()
    acceptable_answers = challenge.solution.get("acceptable_answers", [])

    matched = any(keyword.lower() in submitted for keyword in acceptable_answers)

    if matched:
        feedback = f"Correct! Root cause: {challenge.solution['root_cause']} Fix: {challenge.solution['fix']}"
    else:
        feedback = (
            "Not quite. Re-check the logs and CLI output for the device(s) closest to "
            "the reported symptom, then try again."
        )

    return matched, feedback
