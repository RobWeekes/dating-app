# Schema Design - Questionnaire System

## Overview
Users fill out multiple questionnaires. Each questionnaire contains multiple questions. Responses track which user answered which questionnaire and their answers.

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          USER                                   │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                                                         │
│ email                                                           │
│ password                                                        │
│ firstName                                                       │
│ lastName                                                        │
│ profilePicture                                                  │
│ age                                                             │
│ gender                                                          │
│ location                                                        │
│ bio                                                             │
│ createdAt                                                       │
│ updatedAt                                                       │
└─────────────────────────────────────────────────────────────────┘
         │
         │ 1:M (One user completes many questionnaires)
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    QUESTIONNAIRE_RESPONSE                       │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                                                         │
│ userId (FK → User.id)                                           │
│ questionnaireId (FK → Questionnaire.id)                         │
│ completedAt                                                     │
│ createdAt                                                       │
│ updatedAt                                                       │
│ status ('in_progress', 'completed')                             │
└─────────────────────────────────────────────────────────────────┘
                       │
                       │ 1:M
                       │
                       ▼
         ┌─────────────────────────────────────────┐
         │         ANSWER                          │
         ├─────────────────────────────────────────┤
         │ id (PK)                                 │
         │ questionnaireResponseId (FK)            │
         │ questionId (FK → Question.id)           │
         │ value (text/number/json)                │
         │ createdAt                               │
         └─────────────────────────────────────────┘
                       ▲
                       │ M:1
                       │
         ┌─────────────────────────────────────────┐
         │      QUESTION                           │
         ├─────────────────────────────────────────┤
         │ id (PK)                                 │
         │ questionnaireId (FK)                    │
         │ text                                    │
         │ type (text/radio/checkbox/slider)       │
         │ options (json array)                    │
         │ required (boolean)                      │
         │ order (number)                          │
         │ createdAt                               │
         └─────────────────────────────────────────┘
                       ▲
                       │ M:1
                       │
┌─────────────────────────────────────────────────────────────────┐
│                      QUESTIONNAIRE                              │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                                                         │
│ type (e.g., 'essential', 'compatibility', 'interests')         │
│ title                                                           │
│ description                                                     │
│ category                                                        │
│ version                                                         │
│ isActive (boolean)                                              │
│ createdAt                                                       │
│ updatedAt                                                       │
└─────────────────────────────────────────────────────────────────┘
         ▲
         │ M:1
         │
         └─────────── Many users complete this questionnaire
```

## Relationships Summary

| From | To | Type | Through |
|------|----|----|---------|
| **User** | **Questionnaire** | M:M | QuestionnaireResponse |
| **Questionnaire** | **Question** | 1:M | Direct FK |
| **QuestionnaireResponse** | **Answer** | 1:M | Direct FK |

## Data Flow Example

```
User (id: 1) fills out Essential Questionnaire (id: 101):

1. Create QuestionnaireResponse:
   - userId: 1
   - questionnaireId: 101
   - status: 'in_progress'

2. Create Answers for each question:
   Answer 1:
   - questionnaireResponseId: (from step 1)
   - questionId: 501
   - value: "I'm looking for something serious"

   Answer 2:
   - questionnaireResponseId: (from step 1)
   - questionId: 502
   - value: "Yes"
   ...

3. Update QuestionnaireResponse:
   - status: 'completed'
   - completedAt: current timestamp
```

## Query Examples

### Get user's essential questionnaire response
```sql
SELECT qr.*, a.*, q.text as question_text
FROM questionnaire_responses qr
JOIN answers a ON qr.id = a.questionnaire_response_id
JOIN questions q ON a.question_id = q.id
WHERE qr.user_id = 1 AND qr.questionnaire_id = 101
ORDER BY q.order;
```

### Get all users who completed essential questionnaire
```sql
SELECT DISTINCT u.*
FROM users u
JOIN questionnaire_responses qr ON u.id = qr.user_id
WHERE qr.questionnaire_id = 101;
```

### Check if user completed a questionnaire
```sql
SELECT EXISTS(
  SELECT 1 FROM questionnaire_responses
  WHERE user_id = 1 AND questionnaire_id = 101 AND status = 'completed'
);
```

## Indexes to Create

```sql
CREATE INDEX idx_questionnaire_responses_user_id ON questionnaire_responses(user_id);
CREATE INDEX idx_questionnaire_responses_questionnaire_id ON questionnaire_responses(questionnaire_id);
CREATE INDEX idx_questionnaire_responses_status ON questionnaire_responses(status);
CREATE INDEX idx_answers_questionnaire_response_id ON answers(questionnaire_response_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_questions_questionnaire_id ON questions(questionnaire_id);
```

## Migration Path

1. ✅ User model exists
2. ⏳ Questionnaire model (template/definition)
3. ⏳ Question model (questions within each questionnaire)
4. ⏳ QuestionnaireResponse model (tracks user submissions)
5. ⏳ Answer model (individual answers)

## Notes

- **Questionnaire**: The template (reusable definition)
- **QuestionnaireResponse**: A user's submission of a questionnaire
- **Answer**: Individual answer to a question within a response
- Support for future questionnaire types: compatibility, interests, values, etc.
- Status tracking allows for draft/incomplete questionnaires
- Versioning allows questionnaire updates without losing historical data
