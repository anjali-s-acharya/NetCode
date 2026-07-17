import json
from pathlib import Path

from sqlalchemy.orm import Session

from app.models import Lesson

LESSONS_DIR = Path(__file__).resolve().parent.parent / "data" / "lessons"


def seed_lessons(db: Session) -> None:
    existing_ids = {row[0] for row in db.query(Lesson.id).all()}

    for path in sorted(LESSONS_DIR.glob("*.json")):
        data = json.loads(path.read_text())
        if data["id"] in existing_ids:
            continue
        db.add(
            Lesson(
                id=data["id"],
                title=data["title"],
                category=data["category"],
                track=data["track"],
                order=data["order"],
                points=data["points"],
                question_type=data["question_type"],
                choices=data["choices"],
                content=data["content"],
                check=data["check"],
                solution=data["solution"],
            )
        )

    db.commit()
