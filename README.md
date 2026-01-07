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

---

## Developer Notes: UI Library, Business Logic, and KPI Calculations

### UI Library

- Shared UI components live in `src/app/components/ui/` and include `CardComponent`, `ButtonComponent`, `BadgeComponent`, `SpinnerComponent`, `AlertComponent`, `SelectComponent`, and `StatCardComponent`.
- Components are implemented as standalone Angular components and imported directly into pages. They rely on global SCSS variables in `src/styles.scss` for theming (light/dark) and spacing.
- When creating new UI elements, prefer reusing these primitives to maintain consistent theming and accessibility.

### Business Logic (Frontend responsibilities)

- API wrappers: Each domain area has an API service (`src/app/services/*-api.service.ts`) that sanitizes and prepares DTOs before sending to the NestJS backend.
- Quiz creation flow (teacher): multi-step wizard saved in `sessionStorage` across `step1`/`step2`/`step3`. The client sends a `CreateTeacherQuizDto` to `POST /teacher/quizzes` (creates a DRAFT). To publish immediately, the client calls `POST /teacher/quizzes/:quizId/publish` after creation.
- Question bank: Questions are categorized by `TeachingUnit`. Teachers may create new questions inline while creating a quiz; the client creates the question in the bank and links it to the quiz in one flow.
- Authentication: `src/app/core/http/auth.interceptor.ts` attaches access tokens to requests and attempts token refresh on 401 responses using a stored refresh token. If refresh fails, the app clears session and requires re-login.

### KPI & Participation Calculations

- KPI and analytics logic is implemented in `src/app/services/statistics.service.ts`.
- Participation-related metrics use two closely-related definitions:
	- Invitations-based (used in participation analytics): participationRate = ((inProgress + completed) / totalInvitations) * 100
		- totalInvitations = invited + inProgress + completed + missed
	- Students-based (used in some KPIs and recommendations): participationRate = ((inProgress + completed) / totals.students) * 100
- To avoid impossible KPI values (>100%), students-based participation rates are clamped to 100% in the frontend. However, the most accurate approach is to compute unique participating students server-side and return that value to the frontend.

### Where to look in the code

- UI components: `src/app/components/ui`
- Teacher flows & API: `src/app/services/teacher-api.service.ts` and `src/app/pages/teacher/*`
- Statistics & KPI computations: `src/app/services/statistics.service.ts`
- Auth interceptor: `src/app/core/http/auth.interceptor.ts`

## KPIs and Formulae (Reference)

Below are the KPIs and their formulas written in plain English.

### Dean KPIs
- Total Students: the total number of enrolled students.
- Total Teachers: the total number of registered teachers.
- Quizzes Created: the total number of quizzes created.
- Average Score: the average percentage score across graded attempts (provided by the backend).
- Completion Rate: the percentage of invitations that were completed — calculated as "number of completed attempts divided by total invitations, then multiplied by 100".
  - Total invitations is the sum of invited, in-progress, completed and missed invitations.
- Participation Rate (students-based): the percentage of enrolled students who participated — calculated as "total invitations divided by total enrolled students, multiplied by 100", but capped at 100% to avoid values above 100% when invitations double-count students.
- Questions Bank: total number of questions in the question repository.
- Classes: total number of active classes.

### Teacher KPIs
- My Courses: number of courses assigned to the teacher.
- My Students: the number of unique students across the teacher's quizzes (count each student once).
- Quizzes Created: number of quizzes the teacher created.
- Questions Created: total number of questions across the teacher's quizzes.
- Average Score: the average percent score across all valid student attempts for the teacher's quizzes.
- Completion Rate: the percentage of participants who completed quizzes — calculated as "number of completed attempts divided by total participants, then multiplied by 100".

### Participation Analytics
- Total Invitations: total number of quiz invitations sent (includes invited, in-progress, completed, and missed).
- Total Participants: number of participants (in-progress plus completed).
- Participation Rate (invitations-based): the percentage of invitations that correspond to active participation — calculated as "participants divided by total invitations, multiplied by 100".
- Completion Rate (invitations-based): the percentage of invitations that were completed — calculated as "completed divided by total invitations, multiplied by 100".

Notes:
- The frontend uses two related definitions of participation: an invitations-based metric (percent of invitations that led to participation) and a students-based metric (percent of enrolled students reached). Because invitations can double-count students across multiple quizzes, the students-based value is clamped to 100% on the frontend. For precise institution-level participation, compute unique participating students on the server and return that deduplicated count.

