# QUIIZY (EQuizz) — Frontend Web (Angular)

QUIIZY is a digital assessment platform for continuous and end-of-semester exams. It replaces paper-based exams with a web + mobile solution that supports online/offline delivery (students), anonymous grading, and statistics/reporting.

This repository contains the Angular web application used for web access (administration/teaching workflows and student web access, depending on the module).

## Product requirements (summary)

### Roles

- **Administrator**: manages academic structure (years/semesters), evaluation types, subjects, and mini-admin accounts.
- **Mini-Administrator (Branch Admin)**: manages classes, teacher accounts, and student accounts for a department/branch. Associate a class to a teacher and class in an academic year to create a course. 
- **Teacher**: creates/manages exams and questions, manages grading, creates mock tests for the courses (association of teacher, class and teaching unit) assigned to him. Can access to all existing questions from the system grouped ny teaching unit. Can see detailed breakdowns of student answers to quizzes and do sentiment analysis.
- **Student**: takes exams and views results (web and/or mobile, depending on deployment).

### Core features

- Academic structure management (academic years, semesters, evaluation types, subjects/courses, classes/departments)
- Exam & question management (CRUD questions/exams, mock tests, archiving)
- Student access (matricule + class + institutional email validation; optional student card login)
- Anonymous grading (student identity hidden during grading)
- Dashboards & reporting (filters by year/class/subject/exam type/session; exportable reports)
- Real-time notifications in the web UI via backend events (SSE)
- Sentiment analysis on open-ended responses (via external AI service, exposed to administrators)

## Architecture

- **Frontend (this repo)**: Angular + TypeScript
- **Backend**: NestJS API + PostgreSQL + role-based access
- **Real-time (web)**: Server-Sent Events (SSE) from the backend to the Angular client

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- pnpm

### Install

```bash
pnpm install
```

### Run (development)

```bash
pnpm start
```

Then open `http://localhost:4200/`.

## Scripts

```bash
pnpm start     # ng serve
pnpm build     # ng build
pnpm test      # ng test
pnpm watch     # ng build --watch --configuration development
```

## Project structure (high level)

- `src/app/core/` — app configuration, auth, HTTP client/interceptors, storage
- `src/app/pages/` — feature pages (e.g., login)
- `src/app/components/ui/` — shared UI components
- `src/app/realtime/` — SSE integration and event types

## Backend integration

- API calls go through the app’s API client in `src/app/core/http/`
- Real-time updates use SSE (see the backend README for connection details and event types)

## Notes

- This README describes the intended behavior from the project specification. Some features may be implemented progressively depending on the sprint/iteration.

## Team

- MOUTCHEU SOMO Gift Anderson
- FOTSING KEGNE Weber
- ABENA Alex Nelson Ryan
