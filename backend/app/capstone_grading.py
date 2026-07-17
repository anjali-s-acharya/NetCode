from app.matching import answers_match


def grade_capstone_stage(stage: dict, answer: str) -> tuple[bool, str]:
    solution = stage["solution"]
    acceptable_answers = solution.get("acceptable_answers", [])
    min_matches = solution.get("min_matches", 1)

    if stage["question_type"] == "mcq":
        flat = [
            p.lower()
            for entry in acceptable_answers
            for p in (entry if isinstance(entry, list) else [entry])
        ]
        matched = answer.strip().lower() in flat
    else:
        # free_text and fill_blank both use the shared matcher; fill_blank
        # additionally accepts a shorter-but-unambiguous fragment
        matched = answers_match(
            acceptable_answers,
            answer,
            min_matches,
            bidirectional=(stage["question_type"] == "fill_blank"),
        )

    if matched:
        feedback = f"Correct! {solution['explanation']}"
    else:
        feedback = "Not quite. Re-read the stage artifacts and try again."

    return matched, feedback
