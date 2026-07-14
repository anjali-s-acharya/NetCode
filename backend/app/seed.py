import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models import Challenge

CHALLENGES_DIR = Path(__file__).resolve().parent.parent / "data" / "challenges"


def seed_challenges(db: Session) -> None:
    existing_ids = {row[0] for row in db.query(Challenge.id).all()}

    for path in sorted(CHALLENGES_DIR.glob("*.json")):
        data = json.loads(path.read_text())
        if data["id"] in existing_ids:
            continue
        db.add(
            Challenge(
                id=data["id"],
                title=data["title"],
                track=data["track"],
                difficulty=data["difficulty"],
                points=data["points"],
                ticket=data["ticket"],
                topology=data["topology"],
                logs=data["logs"],
                cli_outputs=data["cli_outputs"],
                monitoring=data["monitoring"],
                hints=data["hints"],
                solution=data["solution"],
            )
        )

    db.commit()
