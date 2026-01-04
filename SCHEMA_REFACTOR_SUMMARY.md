# Schema Refactor - Complete Summary

## What Was Done

All schema changes have been implemented to support the proper many-to-many relationship between Users and Questionnaires.

### ✅ 1. New Models Created

#### Question Model (`backend/models/Question.js`)
Stores individual questions within a questionnaire template.

```javascript
{
  id,                 // Primary key
  questionnaireId,    // FK to Questionnaire
  text,              // "What are you looking for?"
  type,              // 'text', 'radio', 'checkbox', 'slider'
  options,           // JSON array of choices
  required,          // Boolean
  order,             // Display order
  createdAt, updatedAt
}
```

#### QuestionnaireResponse Model (`backend/models/QuestionnaireResponse.js`)
Tracks user submissions of questionnaires.

```javascript
{
  id,                // Primary key
  userId,           // FK to User
  questionnaireId,  // FK to Questionnaire (template)
  status,          // 'in_progress' | 'completed'
  completedAt,     // When user finished
  createdAt, updatedAt
}
```

### ✅ 2. Models Updated

#### Questionnaire Model
**Before:** Conflated template + user responses
```javascript
{ id, userId, questionnaire, interests, datingGoal, relationshipType, responses, ... }
```

**After:** Template only
```javascript
{
  id,
  type,          // 'essential', 'compatibility', etc. (unique)
  title,
  description,
  category,
  version,       // Track changes
  isActive,      // Can toggle without deleting
  createdAt, updatedAt
}
```

#### Answer Model
**Before:** Referenced Questionnaire (wrong!)
```javascript
{ id, questionnaireId, questionId (STRING), answer, ... }
```

**After:** References QuestionnaireResponse (correct!)
```javascript
{
  id,
  questionnaireResponseId,  // FK to user's submission
  questionId,              // FK to actual Question
  value,                   // The answer
  createdAt, updatedAt
}
```

#### User Model
**Before:** `User.hasOne(Questionnaire)`
```javascript
// User could only have ONE questionnaire
```

**After:** `User.hasMany(QuestionnaireResponse)`
```javascript
// User can have many responses to many questionnaires
```

### ✅ 3. Relationships Established

**Old (broken):**
```
User (1) ──hasOne──> Questionnaire (1)
                         │
                       (1:M)
                         │
                         v
                       Answer (M)
```

**New (correct):**
```
                    Questionnaire (template)
                           │
                         (1:M)
                           │
User (1) ──hasMany──> QuestionnaireResponse ──M:1──> Question
                           │
                         (1:M)
                           │
                           v
                         Answer (M)
```

### ✅ 4. Routes Refactored

#### Questionnaire Template Endpoints
```
GET  /api/questionnaires              # List all templates
GET  /api/questionnaires/:id          # Get template with questions
GET  /api/questionnaires/type/:type   # Get by type (e.g., 'essential')
```

#### User Response Endpoints
```
POST /api/questionnaires                     # Submit questionnaire (auth required)
GET  /api/questionnaires/responses/user/:userId
GET  /api/questionnaires/responses/user/:userId/questionnaire/:questionnaireId
PUT  /api/questionnaires/:responseId
DELETE /api/questionnaires/:responseId
```

#### Answer Endpoints
```
GET    /api/questionnaires/:responseId/answers
POST   /api/questionnaires/:responseId/answers
PUT    /api/questionnaires/answers/:answerId
DELETE /api/questionnaires/answers/:answerId
```

### ✅ 5. Migrations Created

| File | Purpose |
|------|---------|
| `20260103-create-questionnaire-response.js` | Create questionnaire_responses table |
| `20260103-create-questions.js` | Create questions table |
| `20260103-alter-questionnaires.js` | Refactor questionnaires table |
| `20260103-alter-answers.js` | Update answers table schema |

### ✅ 6. Databases & Indexes

**Tables Created:**
- `questionnaire_responses` (tracks user submissions)
- `questions` (stores individual questions)

**Tables Modified:**
- `questionnaires` (now template-only)
- `answers` (now references response instead of questionnaire)

**Indexes Created:**
```sql
idx_qr_userId           -- Find user's responses
idx_qr_questionnaireId  -- Find who answered what
idx_qr_status           -- Find in-progress vs completed
idx_q_questionnaireId   -- Find questions for a template
idx_a_responseId        -- Find answers for a response
idx_a_questionId        -- Find answers to a question
```

## How It Works Now

### Scenario: User Fills Out Essential Questionnaire

1. **Template exists** in Questionnaires table
   ```
   Questionnaire {
     id: 1,
     type: 'essential',
     title: 'Essential Questionnaire',
     Questions: [Question1, Question2, Question3, ...]
   }
   ```

2. **User submits** via POST /api/questionnaires
   ```javascript
   {
     type: 'essential',
     responses: {
       "1": "Something serious",
       "2": "Yes",
       "3": "Monogamous",
       "4": ["Travel", "Fitness"]
     }
   }
   ```

3. **Backend creates** QuestionnaireResponse record
   ```
   QuestionnaireResponse {
     id: 5001,
     userId: 42,        // Sarah
     questionnaireId: 1,  // Essential
     status: 'completed',
     completedAt: 2024-01-03T15:30:00Z
   }
   ```

4. **Backend creates** Answer records for each question
   ```
   Answer[
     { questionnaireResponseId: 5001, questionId: 1, value: "Something serious" },
     { questionnaireResponseId: 5001, questionId: 2, value: "Yes" },
     { questionnaireResponseId: 5001, questionId: 3, value: "Monogamous" },
     { questionnaireResponseId: 5001, questionId: 4, value: '["Travel","Fitness"]' }
   ]
   ```

5. **Frontend redirects** to /profile ✅

## What's Now Possible

✅ **Multiple questionnaires per user**
- User can fill out Essential, Compatibility, Interests, etc.
- Separate response records for each

✅ **Reusable templates**
- Same questionnaire template used by all users
- One source of truth for questions

✅ **Question management**
- Add/remove/modify questions in templates
- New versions don't affect old responses

✅ **Advanced matching**
- Query users by their answers
- Find compatible matches based on responses
- Track questionnaire completion status

✅ **Data integrity**
- Structured data instead of JSON blobs
- Foreign keys ensure consistency
- Easy to migrate and backup

## Files Changed

**Backend Models:**
- ✅ `backend/models/Question.js` (NEW)
- ✅ `backend/models/QuestionnaireResponse.js` (NEW)
- ✅ `backend/models/Questionnaire.js` (UPDATED)
- ✅ `backend/models/Answer.js` (UPDATED)
- ✅ `backend/models/User.js` (UPDATED)

**Backend Routes:**
- ✅ `backend/routes/questionnaires.js` (COMPLETELY REWRITTEN)

**Migrations:**
- ✅ `backend/migrations/20260103-create-questionnaire-response.js` (NEW)
- ✅ `backend/migrations/20260103-create-questions.js` (NEW)
- ✅ `backend/migrations/20260103-alter-questionnaires.js` (NEW)
- ✅ `backend/migrations/20260103-alter-answers.js` (NEW)

**Documentation:**
- ✅ `SCHEMA_COMPATIBILITY_REPORT.md` (compatibility analysis)
- ✅ `SCHEMA_MIGRATION_GUIDE.md` (step-by-step setup)
- ✅ `SCHEMA_REFACTOR_SUMMARY.md` (this file)

## Next Steps

### Phase 1: Database Setup (TODAY)
1. Delete old database: `rm backend/dating_app.db`
2. Run migrations: `npm run migrate` (in backend/)
3. Seed templates: `npm run seed`
4. Test endpoints with curl

### Phase 2: Testing (OPTIONAL)
1. Create integration tests
2. Test form submission end-to-end
3. Verify answer storage and retrieval

### Phase 3: Future Features
1. Add Compatibility Questionnaire template
2. Implement user matching algorithm
3. Add preference-based filtering
4. Create questionnaire analytics

## Testing the Schema

### Quick Test
```bash
# 1. Get template
curl http://localhost:3001/api/questionnaires/1

# 2. Submit response (need valid token)
curl -X POST http://localhost:3001/api/questionnaires \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type": "essential", "responses": {"1": "Something serious", "2": "Yes"}}'

# 3. Get user's responses
curl http://localhost:3001/api/questionnaires/responses/user/1
```

## Backward Compatibility

⚠️ **BREAKING CHANGE**

The old Questionnaire table (with userId) is completely refactored. Old code will NOT work:

**Old (broken):**
```javascript
const q = await Questionnaire.findOne({ where: { userId } });
```

**New (correct):**
```javascript
const qr = await QuestionnaireResponse.findOne({ where: { userId, questionnaireId } });
```

Update any code that queries Questionnaire to use QuestionnaireResponse instead.

## Architecture Benefits

| Aspect | Before | After |
|--------|--------|-------|
| **Users per Questionnaire** | 1 | Many |
| **Questionnaires per User** | 1 | Many |
| **Question Storage** | JSON blob | Structured table |
| **Answer Storage** | JSON blob | Structured table |
| **Reusability** | None | Full template reuse |
| **Scalability** | Poor | Excellent |
| **Query Performance** | Slow (JSON parsing) | Fast (indexes) |
| **Data Integrity** | Weak | Strong |

## Summary

Your database schema is now **properly normalized** and **ready for scale**. The refactoring enables:

✅ Multiple questionnaire types (Essential, Compatibility, Interests, etc.)
✅ Users filling multiple questionnaires
✅ Efficient matching and filtering
✅ Better data integrity with foreign keys
✅ Cleaner code and API design

You're ready to add more questionnaire types and implement matching algorithms.
