# LLM Semantic Grading — design (planned, not yet implemented)

The keyword matcher (`backend/app/matching.py`) now supports synonym groups and multi-phrase
requirements, which fixes the worst false accepts/rejects. The next quality jump for free-text
answers (NetCode root-cause/fix, capstone diagnose stages) is LLM-based semantic grading.

## Model choice

**`claude-haiku-4-5`** — $1.00 / $5.00 per million tokens (input/output), 200K context.
A grading call is ~600 input tokens (challenge solution + student answer + rubric prompt) and
~150 output tokens → roughly **$0.001 per grade**. Latency is well under 2s, fine for an
interactive "Grading..." spinner.

## Architecture

```
POST /api/challenges/{id}/submit
  └─ grade_submission()
       ├─ if ANTHROPIC_API_KEY set → llm_grade()   (semantic verdict)
       │     └─ on any API error → fall through
       └─ keyword matcher (matching.answers_match)  (fallback, always available)
```

- New module `backend/app/llm_grading.py`; official `anthropic` Python SDK (`pip install anthropic`).
- Client created once at module level: `client = anthropic.Anthropic()` (reads `ANTHROPIC_API_KEY`).
- Structured verdict via `client.messages.parse()` with a Pydantic model, so no output parsing:

```python
import anthropic
from pydantic import BaseModel

class Verdict(BaseModel):
    correct: bool
    reasoning: str          # 1-2 sentences shown to the student on failure
    partial_credit: bool    # right root cause, missing fix (future: partial points)

client = anthropic.Anthropic()

def llm_grade(solution: dict, root_cause: str, fix: str) -> Verdict:
    response = client.messages.parse(
        model="claude-haiku-4-5",
        max_tokens=1024,
        system=(
            "You grade a network-troubleshooting answer. The student must identify the "
            "root cause and propose a workable fix. Accept different wording, partial "
            "device names, and equivalent fixes. Reject answers that name the wrong "
            "mechanism even if they contain matching keywords."
        ),
        messages=[{
            "role": "user",
            "content": (
                f"Reference root cause: {solution['root_cause']}\n"
                f"Reference fix: {solution['fix']}\n\n"
                f"Student root cause: {root_cause}\n"
                f"Student fix: {fix}"
            ),
        }],
        output_format=Verdict,
    )
    return response.parsed_output
```

- Wrap in `try/except` (`anthropic.APIStatusError`, `anthropic.APIConnectionError`) → fall back
  to the keyword matcher so grading never breaks when the key is absent, rate-limited, or the
  API is down.
- `requirements.txt` gains `anthropic`; deployment gains the `ANTHROPIC_API_KEY` env var
  (Azure Container Apps secret).

## Rollout

1. Ship behind the env var — no key, no behavior change.
2. Log both verdicts (LLM + keyword) for a week; review disagreements to tune the system prompt.
3. Switch feedback text to include `Verdict.reasoning` on incorrect answers (much better
   pedagogy than the generic "Not quite").
4. Later: `partial_credit` → half points; batch API for nightly re-grades of past submissions
   (50% cheaper) if submissions get persisted in Supabase.
