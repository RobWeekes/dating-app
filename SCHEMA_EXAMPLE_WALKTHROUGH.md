# Schema Walkthrough - User Completes Essential Questionnaire

## Scenario
**User "Sarah"** (id: 42, email: sarah@example.com) is filling out the **Essential Questionnaire** on your dating website. Let's trace exactly what happens in the database.

---

## Step 1: Sarah Logs In
Sarah already exists in the `users` table:

```
users table:
┌────┬────────────┬───────────────┬─────────┬────────┐
│ id │ email      │ firstName     │ age     │ gender │
├────┼────────────┼───────────────┼─────────┼────────┤
│ 42 │ sarah@...  │ Sarah         │ 28      │ Female │
└────┴────────────┴───────────────┴─────────┴────────┘
```

---

## Step 2: Questionnaire Template Already Exists

The **Essential Questionnaire** is predefined in the `questionnaires` table (created by admin):

```
questionnaires table:
┌────┬──────────┬──────────────────────┬────────────┐
│ id │ type     │ title                │ description│
├────┼──────────┼──────────────────────┼────────────┤
│101 │essential │Essential Questionnaire│ Your...   │
└────┴──────────┴──────────────────────┴────────────┘
```

And it has predefined questions in the `questions` table:

```
questions table:
┌────┬─────────────────┬────────┬─────────────────────────────┬────────┐
│ id │questionnaireId  │ text   │ type                        │ order  │
├────┼─────────────────┼────────┼─────────────────────────────┼────────┤
│501 │ 101             │"What are you looking for?"│ radio    │ 1      │
│502 │ 101             │"Want kids?"               │ radio    │ 2      │
│503 │ 101             │"Relationship style?"      │ radio    │ 3      │
│504 │ 101             │"Interests?"               │checkbox  │ 4      │
└────┴─────────────────┴────────┴─────────────────────────────┴────────┘
```

---

## Step 3: Sarah Starts Filling Out the Form

She visits: `http://localhost:3000/questionnaire/essential`

The frontend fetches the questionnaire template:
```javascript
GET /api/questionnaires/101  // Get the Essential Questionnaire template
```

The backend returns:
```json
{
  "id": 101,
  "type": "essential",
  "title": "Essential Questionnaire",
  "questions": [
    {
      "id": 501,
      "text": "What are you looking for?",
      "type": "radio",
      "options": ["Something serious", "Casual dating", "Not sure"]
    },
    {
      "id": 502,
      "text": "Do you want kids?",
      "type": "radio",
      "options": ["Yes", "No", "Maybe"]
    },
    {
      "id": 503,
      "text": "What's your relationship style?",
      "type": "radio",
      "options": ["Monogamous", "Open relationship", "Exploring options"]
    },
    {
      "id": 504,
      "text": "What are your interests?",
      "type": "checkbox",
      "options": ["Travel", "Fitness", "Art", "Music", "Cooking", "Gaming"]
    }
  ]
}
```

---

## Step 4: Sarah Fills Out Answers

She answers the questions:

1. "What are you looking for?" → **"Something serious"**
2. "Do you want kids?" → **"Yes"**
3. "What's your relationship style?" → **"Monogamous"**
4. "What are your interests?" → **["Travel", "Fitness", "Cooking"]** (she selects 3)

---

## Step 5: Sarah Clicks "Submit Questionnaire"

Her frontend makes a POST request:

```javascript
POST http://localhost:3001/api/questionnaires
Headers: { Authorization: Bearer <token>, Content-Type: application/json }
Body: {
  "type": "essential",
  "relationshipType": "monogamous",
  "responses": {
    "501": "Something serious",
    "502": "Yes",
    "503": "Monogamous",
    "504": ["Travel", "Fitness", "Cooking"]
  }
}
```

---

## Step 6: Backend Creates a QuestionnaireResponse Record

When the backend receives the submission, it:

1. **Extracts userId from token**: Sarah's userId = 42
2. **Creates QuestionnaireResponse**: Marks that Sarah (user 42) submitted the Essential Questionnaire (questionnaire 101)

```sql
INSERT INTO questionnaire_responses (userId, questionnaireId, status, completedAt, createdAt)
VALUES (42, 101, 'completed', NOW(), NOW());
-- Returns: id = 5001 (this is the response ID)
```

**questionnaire_responses table now has:**
```
┌──────┬────────┬─────────────────┬───────────┬────────────────┐
│ id   │ userId │ questionnaireId  │ status    │ completedAt    │
├──────┼────────┼─────────────────┼───────────┼────────────────┤
│ 5001 │ 42     │ 101             │completed  │ 2024-01-03...  │
└──────┴────────┴─────────────────┴───────────┴────────────────┘
```

---

## Step 7: Backend Creates Answer Records

For each question Sarah answered, create an `Answer`:

```sql
INSERT INTO answers (questionnaireResponseId, questionId, value)
VALUES 
  (5001, 501, 'Something serious'),
  (5001, 502, 'Yes'),
  (5001, 503, 'Monogamous'),
  (5001, 504, '["Travel", "Fitness", "Cooking"]');
```

**answers table now has:**
```
┌────┬──────────────────────────┬────────────┬────────────────────────────────┐
│ id │questionnaireResponseId   │questionId  │ value                          │
├────┼──────────────────────────┼────────────┼────────────────────────────────┤
│701 │ 5001                     │ 501        │ "Something serious"            │
│702 │ 5001                     │ 502        │ "Yes"                          │
│703 │ 5001                     │ 503        │ "Monogamous"                   │
│704 │ 5001                     │ 504        │ '["Travel","Fitness","Cooking"]'│
└────┴──────────────────────────┴────────────┴────────────────────────────────┘
```

---

## Step 8: Response Sent to Frontend

Backend returns 201 Created:

```json
{
  "id": 5001,
  "userId": 42,
  "questionnaireId": 101,
  "status": "completed",
  "completedAt": "2024-01-03T15:30:00Z",
  "answers": [
    { "questionId": 501, "value": "Something serious" },
    { "questionId": 502, "value": "Yes" },
    { "questionId": 503, "value": "Monogamous" },
    { "questionId": 504, "value": ["Travel", "Fitness", "Cooking"] }
  ]
}
```

Frontend redirects to `/profile` ✅

---

## Step 9: Complete Picture - Relationships

Now the data is connected:

```
Sarah (User 42)
    ↓ (completed)
Essential Questionnaire (id: 101)
    ↓ (this specific submission)
QuestionnaireResponse (id: 5001)
    ↓ (contains 4 answers)
Answers:
  • Question 501: "Something serious"
  • Question 502: "Yes"
  • Question 503: "Monogamous"
  • Question 504: ["Travel", "Fitness", "Cooking"]
```

---

## Step 10: Finding Matches

Now you can query to **find compatible matches** for Sarah:

```sql
-- Find other users who also want something serious and want kids
SELECT DISTINCT u.id, u.firstName, u.email
FROM users u
JOIN questionnaire_responses qr ON u.id = qr.userId
JOIN answers a ON qr.id = a.questionnaireResponseId
WHERE qr.questionnaireId = 101
  AND u.id != 42  -- Exclude Sarah
  AND EXISTS (
    SELECT 1 FROM answers a1
    WHERE a1.questionnaireResponseId = qr.id
      AND a1.questionId = 501  -- "What are you looking for?"
      AND a1.value = 'Something serious'
  )
  AND EXISTS (
    SELECT 1 FROM answers a2
    WHERE a2.questionnaireResponseId = qr.id
      AND a2.questionId = 502  -- "Want kids?"
      AND a2.value = 'Yes'
  );
```

---

## Key Insights

| Component | Purpose | Example |
|-----------|---------|---------|
| **Questionnaire** | Template/definition | Essential Questionnaire (reusable) |
| **Question** | Individual question in template | "What are you looking for?" |
| **QuestionnaireResponse** | User's submission | Sarah completed Essential (once per user per questionnaire) |
| **Answer** | User's specific answer | Sarah answered "Something serious" to Q501 |

**Data Integrity:**
- Sarah can fill out the Essential Questionnaire **once** (or update it)
- Each questionnaire has predefined questions
- All answers are linked back to the questionnaire response
- Easy to find users with matching answers

**Scalability:**
- Add new questionnaire types: Compatibility, Interests, Values, etc.
- Each questionnaire is independent
- Questions are reusable across versions
- Historical data preserved (can track updates)
