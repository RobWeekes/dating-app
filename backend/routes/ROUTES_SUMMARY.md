# Questionnaires Routes Summary

## Overview

This file defines **questionnaire management endpoints** with three main sections:

---

## 1. Template Management
Gets questionnaire definitions (the template questions, not user responses)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | All active questionnaires with their questions |
| GET | `/:id` | Specific questionnaire by ID |
| GET | `/type/:type` | Questionnaire by type (e.g., "MVP Questionnaire", "Casual Dating") |

---

## 2. User Responses
Tracks questionnaire submissions (user answers and completion status)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/responses/user/me/questionnaire/:questionnaireId` | Current user's response (authenticated) |
| GET | `/responses/user/:userId/questionnaire/:questionnaireId` | Any user's response |
| GET | `/responses/user/:userId` | All responses from a user |
| POST | `/` | Submit/save a completed questionnaire (creates or updates response + answers) |
| PUT | `/:responseId` | Update response status |
| DELETE | `/:responseId` | Delete a response |

---

## 3. Answer Management
Individual question responses within a questionnaire response

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/:responseId/answers` | All answers in a response |
| POST | `/:responseId/answers` | Add an answer |
| PUT | `/answers/:answerId` | Update an answer |
| DELETE | `/answers/:answerId` | Delete an answer |

---

## Key Features

### POST Endpoint Details (Submission)
The `POST /` endpoint handles questionnaire submission with smart logic:

- Accepts both **MVP format** (`q1`, `q2`, etc.) and **ID-based** question references
- Maps question keys to actual question IDs in the database
- Stores answers with type flexibility (strings or JSON)
- **Upsert behavior**: If a user resubmits, updates their existing response instead of creating duplicates
- Creates associated `Answer` records for each question
- Returns complete response object with all answers and metadata

### Authentication
- `POST /` requires `authenticateToken` middleware (user must be logged in)
- Other endpoints are generally public (consider adding auth to sensitive data)

### Response Structure
All responses include:
- `QuestionnaireResponse` record (user response metadata)
- `Answer` records (individual answers)
- Associated `Question` records (for context)
- Associated `Questionnaire` record (template metadata)

---

## Data Flow

```
1. Frontend or client displays questionnaire template
   GET /questionnaires (or GET /questionnaires/:id)

2. User fills out questionnaire

3. Frontend submits all answers
   POST /questionnaires { type, responses: {q1: value, q2: value, ...} }

4. Backend creates/updates QuestionnaireResponse
   More details... - creates Answer records

5. Backend returns confirmation with saved data

6. Frontend can later retrieve past responses
   GET /questionnaires/responses/user/me/questionnaire/:questionnaireId
```
