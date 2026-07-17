import re


def _normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower()).strip()


def answers_match(
    acceptable_answers: list, submitted: str, min_matches: int = 1, bidirectional: bool = False
) -> bool:
    """Match a free-text submission against acceptable answers.

    Each entry in acceptable_answers is either a phrase (str) or a synonym
    group (list of phrases) — a group matches if any of its phrases appears in
    the submission. The submission is correct when at least min_matches
    entries/groups match. Normalization is lowercase + whitespace collapse
    only, so identifiers like IPs and interface names match literally.

    bidirectional=True also accepts a submission that is itself contained in a
    phrase (the fill-in-the-blank behavior, where a shorter-but-unambiguous
    fragment of the expected code should pass).
    """
    normalized = _normalize(submitted)

    def phrase_hit(phrase: str) -> bool:
        p = _normalize(phrase)
        return p in normalized or (bidirectional and normalized != "" and normalized in p)

    matched = 0
    for entry in acceptable_answers:
        phrases = entry if isinstance(entry, list) else [entry]
        if any(phrase_hit(p) for p in phrases):
            matched += 1
            if matched >= min_matches:
                return True
    return False
