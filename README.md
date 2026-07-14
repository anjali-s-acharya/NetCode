# NetCode

LeetCode-style troubleshooting practice for network engineers. Each challenge is a
trouble ticket with topology, logs, CLI output, and monitoring data; you diagnose the
root cause and propose a fix.

## Stack

- Frontend: React + Vite + TypeScript
- Backend: FastAPI + SQLAlchemy
- DB: SQLite (file-based, seeded from JSON challenge datasets on startup)
- Progress (solved challenges, points): browser localStorage — no auth in this MVP

## Running locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Runs on http://localhost:8001 (8000 is often taken by other local services — the
frontend is configured to call 8001). On first startup it creates `netcode.db` and
seeds challenges from `backend/data/challenges/*.json`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173.

## Adding a new challenge

Drop a new JSON file into `backend/data/challenges/` following the shape of
`dns-timeout-001.json` (id, title, track, difficulty, points, ticket, topology, logs,
cli_outputs, monitoring, hints, solution) and restart the backend — `seed_challenges`
only inserts ids that aren't already in the DB, so existing challenges and any local
progress are left alone. Points convention: Easy = 100, Medium = 200, Hard = 350.

Currently seeded: 21 challenges across DNS, DHCP, Routing, and Switching (11 Easy, 6
Medium, 4 Hard). Security and SD-WAN tracks aren't populated yet.

Grading is a simple keyword/substring match against `solution.acceptable_answers` —
not NLP. When writing `acceptable_answers`, make sure the challenge's own
`root_cause` + `fix` text actually contains at least one of the listed phrases
(otherwise the "correct" answer wouldn't pass its own grading), and prefer specific
multi-word phrases or identifiers over generic single words to avoid false positives
on wrong guesses.

## What's not built yet

Auth, leaderboards, daily challenges, AI-powered hints, and interview prep mode are
out of scope for this pass — see the product spec for the full feature list.
