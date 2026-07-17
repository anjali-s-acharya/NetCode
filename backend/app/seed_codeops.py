import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models import CodeOpsChallenge

CODEOPS_DIR = Path(__file__).resolve().parent.parent / "data" / "codeops"


def seed_codeops_challenges(db: Session) -> None:
    existing_ids = {row[0] for row in db.query(CodeOpsChallenge.id).all()}

    for path in sorted(CODEOPS_DIR.glob("*.json")):
        data = json.loads(path.read_text())
        if data["id"] in existing_ids:
            continue
        db.add(
            CodeOpsChallenge(
                id=data["id"],
                title=data["title"],
                track=data["track"],
                difficulty=data["difficulty"],
                points=data["points"],
                question_type=data["question_type"],
                choices=data["choices"],
                problem=data["problem"],
                hints=data["hints"],
                solution=data["solution"],
            )
        )

    db.commit()
