# NetCode

A gamified learning platform for network engineers, with three independent categories
picked from the home page:

- **Networking Basics** — guided lessons for people new to networking: a short
  explanation and example for one concept at a time (DNS, DHCP, Routing, Switching),
  followed by a quick check. Lessons unlock in order within each track.
- **Coding Basics** — guided lessons for people who have never written code: Python,
  REST APIs, and Git & GitHub fundamentals, taught the same way — explanation, example,
  quick check, one concept at a time.
- **Practice** — for people already comfortable with the basics:
  - **NetCode** — LeetCode-style troubleshooting practice. Each challenge is a trouble
    ticket with topology, logs, CLI output, and monitoring data; you diagnose the root
    cause and propose a fix.
  - **CodeOps** — Learn network automation (Python, REST APIs, Git, Netmiko, Ansible,
    Terraform) by solving multiple-choice and fill-in-the-blank problems grounded in
    real day-to-day automation tasks, instead of watching tutorials.
- **Capstone Labs** — full-incident labs that fuse both skill sets: diagnose an outage
  (NetCode-style), write the automation fix (kata-style), then add the guardrail that
  prevents recurrence. Stages unlock sequentially.

The home page also shows a gamified stats strip (XP, level titles, 🔥 daily streak,
solved count) and a deterministic **daily challenge** picked from the NetCode+CodeOps
pool. A leaderboard is planned for the Supabase pass (see `docs/supabase-setup.md`).

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
seeds challenges from `backend/data/challenges/*.json` (NetCode),
`backend/data/codeops/*.json` (CodeOps), and `backend/data/lessons/*.json` (Basics).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on http://localhost:5173.

## Adding a new NetCode challenge

Drop a new JSON file into `backend/data/challenges/` following the shape of
`dns-timeout-001.json` (id, title, track, difficulty, points, ticket, topology, logs,
cli_outputs, monitoring, hints, solution) and restart the backend — `seed_challenges`
only inserts ids that aren't already in the DB, so existing challenges and any local
progress are left alone. Points convention: Easy = 100, Medium = 200, Hard = 350.

Currently seeded: 32 challenges across DNS, DHCP, Routing, Switching, Security, SD-WAN,
and Automation ("automation-broke-it": outages caused by bad Ansible/Netmiko/Terraform
changes).

Grading is keyword matching against `solution.acceptable_answers` — not NLP (an
LLM-grading upgrade is designed in `docs/llm-grading-plan.md`). Each entry is either a
phrase (matches if it appears in the submission) or a **synonym group** (a list of
phrases — the group matches if any one appears). Optional `solution.min_matches`
(default 1) sets how many entries/groups must match; use 2 with one
"what-went-wrong" group and one "specific identifier" group to require both concept
and specifics. Make sure the challenge's own `root_cause`/`fix` text would pass its
own grading, and prefer specific multi-word phrases over generic single words.

## Adding a new CodeOps challenge

Drop a new JSON file into `backend/data/codeops/` following the shape of
`python-down-interfaces-001.json` (id, title, track, difficulty, points,
question_type, choices, problem, hints, solution) and restart the backend —
`seed_codeops_challenges` follows the same insert-if-new-id behavior as NetCode's
seeding. Points convention matches NetCode: Easy = 100, Medium = 200, Hard = 350.

`question_type` is either `"mcq"` (frontend renders `choices` as radio buttons) or
`"fill_blank"` (frontend renders a free-text box); `choices` should be `[]` for
fill_blank. Grading compares the submitted answer against
`solution.acceptable_answers`: MCQ requires an exact case-insensitive match, fill_blank
allows a substring match either direction — so for fill_blank, list the specific code
or phrase you expect, not single generic words.

Currently seeded: 22 challenges — Python ×7 (incl. a pyATS/Genie problem, a syslog
kata, and IPv4/log/CSV fill-in-the-blank drills), REST API ×6 (incl. Catalyst Center,
pagination, and retry/backoff), Git & GitHub ×5 (.gitignore, merge conflicts, CI YAML,
conventional commits), Ansible ×2 (incl. an idempotency kata), Netmiko ×1, and a
Terraform kata (`moved` block).

Note: the Python/REST API problems above are fill-in-the-blank/MCQ against a fixed
solution, not full code execution against hidden test cases — running arbitrary
submitted code safely needs a sandboxed execution service (see the scaling note in any
future content-pack README), which this MVP doesn't have yet.

## Adding a new Capstone

Drop a JSON file into `backend/data/capstones/` following
`capstone-ospf-playbook-001.json`: id, title, track, points_total, and a `stages` list.
Each stage has `title`, `stage_type` (diagnose|fix|guardrail), `question_type`
(free_text|fill_blank|mcq), `points`, `context` ({narrative, artifacts:[{label,
content}]}), `choices` (mcq only), and `solution` (same acceptable_answers/min_matches
format as NetCode). Stages unlock sequentially in the UI; each is graded via
`POST /api/capstones/{id}/stages/{n}/submit`.

Currently seeded: 3 capstones — "The Playbook That Broke OSPF" (Ansible + Routing),
"Bad Ansible Playbook Pushed Wrong VLAN" (missing DHCP relay), and "Terraform Apply
Silently Removed a Route Table Entry" (`aws_route` vs inline `route` blocks).

## Adding a new Basics lesson

Drop a new JSON file into `backend/data/lessons/` following the shape of
`networking-dns-001.json` (id, title, category, track, order, points, question_type,
choices, content, check, solution) and restart the backend — `seed_lessons` follows the
same insert-if-new-id behavior as the other seeders. Points convention: flat 20 pts per
lesson (lessons are much smaller units than a full challenge).

`category` is `"networking"` or `"coding"` — it decides which home-page track the
lesson appears under. `order` is 1-indexed and scoped per `(category, track)`: the
frontend locks any lesson whose same-track predecessor (order - 1) hasn't been solved
yet, so to add a second DNS lesson, give it `"track": "DNS", "order": 2`. `content`
holds the teaching material shown before the check (`explanation` + a short `example`);
`check.statement` is the quick-check question, graded the same way as CodeOps
(`question_type`/`choices`/`solution.acceptable_answers`) — there's no hint system here
since the preceding `content` already teaches the concept.

Currently seeded: 21 lessons — 3 per track across DNS, DHCP, Routing, Switching
(networking) and Python, REST API, GitHub (coding), each track building from a core
concept lesson (order 1) through two follow-ups (orders 2-3), unlocking in sequence.

## Content sources

Command syntax, syslog formats, and API shapes throughout NetCode, CodeOps, and the
Basics lessons are grounded in real, public Cisco material: IOS/IOS-XE command syntax
(`show ip ospf neighbor`, `show etherchannel summary`, `ip dhcp pool`, `ip name-server`,
etc.), Cisco's open-source pyATS/Genie parsing framework (the structured dict shape
`device.parse(...)` returns), and Cisco DevNet's public sandbox API shapes (e.g. Catalyst
Center's Intent API envelope). All explanatory text, trouble-ticket scenarios, and
problem write-ups are original — none of it is copied from Cisco Networking Academy,
Cisco Press, or any other copyrighted Cisco curriculum; only technical facts (real
command names, real API field names) are reused, the same way any technical writing
about a vendor's product would.

## What's not built yet

Auth, leaderboards, daily challenges, AI-powered hints, and interview prep mode are
out of scope for this pass — see the product spec for the full feature list.
