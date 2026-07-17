from app.matching import answers_match
from app.models import Lesson


def grade_lesson_submission(lesson: Lesson, answer: str) -> tuple[bool, str]:
    submitted = answer.strip().lower()
    acceptable_answers = lesson.solution.get("acceptable_answers", [])
    min_matches = lesson.solution.get("min_matches", 1)

    if lesson.question_type == "mcq":
        flat = [
            p.lower()
            for entry in acceptable_answers
            for p in (entry if isinstance(entry, list) else [entry])
        ]
        matched = submitted in flat
    else:
        matched = answers_match(acceptable_answers, answer, min_matches, bidirectional=True)

    if matched:
        feedback = f"Correct! {lesson.solution['explanation']}"
    else:
        feedback = "Not quite. Re-read the explanation above and try again."

    return matched, feedback
