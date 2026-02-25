# Questionnaire DRY Refactor Summary

**A. `backend/data/questionnaire-templates.js`** — Created. Exports `getQuestionnaireTemplates()` with all 98 questions (27 essential + 21 lifestyle + 50 MVP) using canonical types, sections, metadata.

**B. `backend/server.js`** — Replaced ~450 lines of duplicated seed logic with `patchQuestionSchema()` (adds new columns via ALTER TABLE if missing) + clean upsert seeding using the templates file. Eliminated duplicate lifestyle block.

**C. `backend/services/MVPQuestionnaireScorer.js`** — Fixed: added `Questionnaire` import, filtered `getUserResponses` to only fetch MVP questionnaire responses, changed `answer.Question.id` → `answer.Question.order` for correct Q1-Q50 mapping.

**D. `frontend/src/pages/QuestionnairePage.js`** — Created generic page that reads `:type` from URL, fetches template + existing responses, renders `QuestionnaireForm` with `sectioned={type === 'MVP'}`.

**E. `frontend/src/styles/questionnaire-form.css`** — Created consolidated stylesheet with all needed classes and responsive breakpoints.

**F. `frontend/src/routes/index.js`** — Replaced 3 separate routes with `/questionnaire/:type` + redirect from `/questionnaire` → `/questionnaire/MVP`.

**G. `backend/routes/questionnaires.js`** — Added new fields to all GET endpoints' Question attributes, made type lookup case-insensitive.
