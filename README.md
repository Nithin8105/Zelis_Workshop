# AI-Powered Test Generator

Full-stack web application to generate MCQ test papers from syllabus topics and difficulty level.

## Stack

- Frontend: React + Tailwind CSS (Vite)
- Backend: Node.js + Express
- Database: SQLite
- AI: OpenAI API (or OpenAI-compatible API via `OPENAI_BASE_URL`)

## Folder Structure

- `frontend/`
- `backend/`
- `backend/routes/`
- `backend/services/`
- `backend/db/`

## Backend Setup

1. Open terminal in `backend/`
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example` and set your values:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
   - `OPENAI_BASE_URL` (optional for compatible APIs)
   - `JWT_SECRET` (recommended)
   - `DEFAULT_FACULTY_EMAIL`
   - `DEFAULT_FACULTY_PASSWORD`
   - `DEFAULT_STUDENT_EMAIL`
   - `DEFAULT_STUDENT_PASSWORD`
   - `PORT` (optional, default `5000`)
4. Start backend:
   - `npm run dev`

API endpoints:
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/generate-test`
- `GET /api/tests` (faculty conducted history)
- `GET /api/tests/:testId`
- `PATCH /api/tests/:testId/pdf-access` (faculty controls student PDF access)
- `POST /api/tests/:testId/attempts` (student submits attended test)
- `GET /api/tests/:testId/attempts` (faculty gets student details + marks)
- `GET /api/students/me/attempts` (student attended history)

Role permissions:
- `faculty`: login, generate tests, access all tests and answer keys
- `student`: login, open assigned test by ID, attempt test in student module

Example request body:

```json
{
  "topics": "Algebra, Trigonometry, Calculus",
  "difficulty": "medium",
  "numberOfQuestions": 10
}
```

Example response shape:

```json
{
  "testId": 1,
  "topics": ["Algebra", "Trigonometry", "Calculus"],
  "difficulty": "medium",
  "numberOfQuestions": 10,
  "createdAt": "2026-03-14 10:00:00",
  "questions": [
    {
      "topic": "Algebra",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    }
  ]
}
```

## Frontend Setup

1. Open terminal in `frontend/`
2. Install dependencies:
   - `npm install`
3. Create `.env` from `.env.example` if backend is not on default URL
4. Start frontend:
   - `npm run dev`

## Database Schema

SQLite database file: `backend/test-generator.db`

Tables:
- `users`
- `tests`
- `syllabus`
- `generated_questions`
- `test_attempts`

Stored data includes topics, generated MCQs, difficulty, counts, and timestamps.

## Features Implemented

- Input syllabus topics, difficulty, and number of questions
- Separate faculty and student login modules
- Student access via test ID
- Student full-screen attempt mode
- Student attempt persistence with marks
- Faculty view of student details and marks
- Conducted history for faculty and attended history for students
- Student PDF download gating controlled by faculty per test
- Generate MCQ tests through LLM API
- Store test metadata and generated questions in SQLite
- View generated test in frontend
- Download generated test as PDF with safe pagination and optional student response data
- Modular backend services with async/await and error handling
