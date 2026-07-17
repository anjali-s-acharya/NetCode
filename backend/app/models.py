from sqlalchemy import JSON, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Challenge(Base):
    __tablename__ = "challenges"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    track: Mapped[str] = mapped_column(String)
    difficulty: Mapped[str] = mapped_column(String)
    points: Mapped[int] = mapped_column(Integer)

    ticket: Mapped[dict] = mapped_column(JSON)
    topology: Mapped[dict] = mapped_column(JSON)
    logs: Mapped[list] = mapped_column(JSON)
    cli_outputs: Mapped[list] = mapped_column(JSON)
    monitoring: Mapped[dict] = mapped_column(JSON)
    hints: Mapped[list] = mapped_column(JSON)
    solution: Mapped[dict] = mapped_column(JSON)


class CodeOpsChallenge(Base):
    __tablename__ = "codeops_challenges"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    track: Mapped[str] = mapped_column(String)
    difficulty: Mapped[str] = mapped_column(String)
    points: Mapped[int] = mapped_column(Integer)
    question_type: Mapped[str] = mapped_column(String)

    choices: Mapped[list] = mapped_column(JSON)
    problem: Mapped[dict] = mapped_column(JSON)
    hints: Mapped[list] = mapped_column(JSON)
    solution: Mapped[dict] = mapped_column(JSON)


class Capstone(Base):
    __tablename__ = "capstones"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    track: Mapped[str] = mapped_column(String)
    points_total: Mapped[int] = mapped_column(Integer)

    stages: Mapped[list] = mapped_column(JSON)


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    title: Mapped[str] = mapped_column(String)
    category: Mapped[str] = mapped_column(String)
    track: Mapped[str] = mapped_column(String)
    order: Mapped[int] = mapped_column(Integer)
    points: Mapped[int] = mapped_column(Integer)
    question_type: Mapped[str] = mapped_column(String)

    choices: Mapped[list] = mapped_column(JSON)
    content: Mapped[dict] = mapped_column(JSON)
    check: Mapped[dict] = mapped_column(JSON)
    solution: Mapped[dict] = mapped_column(JSON)
