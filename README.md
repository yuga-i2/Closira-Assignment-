![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green)
![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB)
![Expo](https://img.shields.io/badge/Expo-51-black)
![SQLite](https://img.shields.io/badge/SQLite-3-blue)
![Tests](https://img.shields.io/badge/Tests-24%20passing-brightgreen)

# Closira — Engineering Assignment Submission

Full-stack monorepo submission for the Closira engineering internship assignment.  
Implements **both** the Backend REST API and the Frontend React Native mobile dashboard.

---

## Repository Structure

```
closira-assignment/
├── backend/          # Python + FastAPI REST API
├── frontend/         # React Native + Expo mobile app
├── README.md         # This file
├── LICENSE
└── .gitignore
```

---

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API: `http://localhost:8000`  
Swagger docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npx expo start
```

Scan QR code with Expo Go, or press `i` / `a` for simulator.

### Docker (Backend only)

```bash
cd backend
docker-compose up --build
```

## Live Demo

| Service | URL | Notes |
|---|---|---|
| Backend API | http://localhost:8000 | FastAPI + SQLite |
| Swagger Docs | http://localhost:8000/docs | Interactive API explorer |
| Frontend Web | http://localhost:8081 | React Native web build |

## Tests
24 pytest tests — all passing.
```bash
cd backend && pytest tests/ -v
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React Native)                  │
│                                                                 │
│  HomeScreen ──► Dashboard stats, activity feed                  │
│  LeadsScreen ──► Filterable enquiry list                        │
│  EscalationsScreen ──► Active escalation alerts + resolve       │
│  FollowUpsScreen ──► Task list + mark-done                      │
│  ConversationDetailScreen ──► Thread + SOP + timeline           │
│                                                                 │
│  Bottom Tab Navigator ──► Stack Navigator (detail screen)       │
└─────────────────────────────────────────────────────────────────┘
                          ↕  (future: REST API calls)
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                        │
│                                                                 │
│  POST /enquiry ──────────────────────── Create + async process  │
│  POST /enquiry/{id}/follow-up ────────── Schedule follow-up     │
│  POST /enquiry/{id}/escalate ─────────── Manual escalation      │
│  GET  /enquiry/{id}/history ──────────── Full history + SOP     │
│  GET  /health ────────────────────────── Liveness check         │
│                                                                 │
│  FastAPI BackgroundTasks                                        │
│      └── SOP keyword matcher (5 categories)                     │
│              └── Auto-escalates if no match                     │
│                                                                 │
│  SQLAlchemy ORM ──► SQLite (swap to Postgres via DATABASE_URL)  │
│  Structured JSON logging (all key events)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Backend: Database Schema

The `enquiries` table is the single source of truth. Status progression:

```
PROCESSING → OPEN (SOP matched)
           → ESCALATED (no SOP match — auto, or manual via /escalate)
OPEN       → QUALIFIED (manual update)
           → ESCALATED (manual)
ESCALATED  → RESOLVED (manual)
```

Three JSON columns (`status_timeline`, `follow_ups`, `conversation_history`) store append-only audit data alongside the parent row — appropriate for a lightweight service where these arrays are always read with the parent record.

---

## Backend: SOP Categories

| SOP | Trigger Keywords |
|---|---|
| Booking Enquiry | book, appointment, schedule, reserve, slot, availability... |
| Pricing Question | price, cost, how much, fee, quote, rate, package, plan... |
| Complaint | complaint, unhappy, issue, problem, wrong, bad, refund... |
| After-Hours Message | after hours, closed, weekend, holiday, late, early morning... |
| Product Demo Request | demo, demonstration, trial, walkthrough, features, tour... |

Matching uses a scoring system: each keyword match adds 1 point; highest-score SOP wins. No match → auto-escalation.

---

## Frontend: Screen Map

| Screen | Tab | Navigable from |
|---|---|---|
| Home (Dashboard) | Home tab | — |
| Leads | Leads tab | — |
| Escalations | Escalations tab | — |
| Follow-ups | Follow-ups tab | — |
| Conversation Detail | (stack screen) | Leads, Escalations, Activity feed |

---

## Suggested Commit History:

```
git commit -m "chore: initialise monorepo with backend and frontend structure"
git commit -m "feat(backend): FastAPI enquiry API with 5 endpoints"
git commit -m "feat(backend): async SOP keyword matching with auto-escalation"
git commit -m "test(backend): 24 pytest tests covering all endpoints and edge cases"
git commit -m "feat(frontend): React Native dashboard with 5 screens and bottom tab navigation"
git commit -m "feat(frontend): reusable component library — badges, cards, empty states"
git commit -m "feat(frontend): mock data structured as API-ready JSON"
git commit -m "improve(frontend): search bar on leads screen and live API health check"
git commit -m "improve(frontend): synced escalation count across dashboard and escalations screen"
```

---

## Engineering Decisions

### Why FastAPI BackgroundTasks (not Celery)?

SOP keyword matching is a sub-5ms in-process operation — no I/O, no retries needed. BackgroundTasks is zero-dependency and perfectly suited. Celery would add Redis/RabbitMQ infrastructure overhead without benefit for this workload. See `backend/README.md` for the full trade-off table.

### Why SQLite (not PostgreSQL)?

Zero setup for local development and evaluation. SQLAlchemy abstracts the database entirely — swapping to Postgres requires only a `DATABASE_URL` env-var change. See `backend/README.md` for reasoning.

### Why StyleSheet over NativeWind?

Dynamic opacity colours (`COLORS.accent + '20'`) and TypeScript strict mode made StyleSheet + design tokens the more reliable approach. The constants file provides the same single-source-of-truth benefit as Tailwind config. See `frontend/README.md` for full explanation.

---

## Known Limitations

- No authentication on either service
- Backend background tasks are fire-and-forget (no retry on crash)
- Frontend state is in-memory only (resets on reload)
- No real-time push notifications for escalations
- SOP matching is keyword-only — no ML/LLM classifier

All limitations are intentional trade-offs for assignment scope and are documented in each service's README.
