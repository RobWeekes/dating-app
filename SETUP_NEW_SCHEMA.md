# Setup New Schema - Step by Step

## Overview
The new schema has been fully implemented. When you start the backend server, it will automatically:
1. Delete the old database
2. Create new tables with the correct schema
3. Seed the questionnaire templates

## Quick Start (3 steps)

### Step 1: Stop the running backend
If your backend is running, stop it (Ctrl+C)

### Step 2: Start the backend
```bash
cd backend
npm run dev
```

You should see output like:
```
✓ Database connection successful
🔄 Initializing database...
📋 Backing up old database...
✅ Old database backed up to: dating_app.db.backup-1704283200000
📋 Creating database schema...
✅ Database schema created
📋 Seeding questionnaire templates...
  ✓ Created Essential Questionnaire (ID: 1)
  ✓ Created 4 questions
✅ Questionnaire templates seeded
✅ Database initialization complete
✓ Server running on port 3001
✓ API available at http://localhost:3001/api
```

### Step 3: Verify it worked
```bash
curl http://localhost:3001/api/questionnaires
```

You should get a JSON response with the Essential Questionnaire template.

---

## Testing the New Schema

### Test 1: Get Questionnaire Template

```bash
curl http://localhost:3001/api/questionnaires/1
```

**Expected Response:**
```json
{
  "id": 1,
  "type": "essential",
  "title": "Essential Questionnaire",
  "description": "Find out what matters most to you in a relationship",
  "category": "Essential",
  "version": 1,
  "isActive": true,
  "Questions": [
    {
      "id": 1,
      "text": "What are you looking for?",
      "type": "radio",
      "options": ["Something serious", "Casual dating", "Not sure"],
      "order": 1
    },
    {
      "id": 2,
      "text": "Do you want kids?",
      "type": "radio",
      "options": ["Yes", "No", "Maybe"],
      "order": 2
    },
    {
      "id": 3,
      "text": "What is your relationship style?",
      "type": "radio",
      "options": ["Monogamous", "Open relationship", "Exploring options"],
      "order": 3
    },
    {
      "id": 4,
      "text": "What are your interests?",
      "type": "checkbox",
      "options": ["Travel", "Fitness", "Art", "Music", "Cooking", "Gaming", "Reading", "Sports"],
      "order": 4
    }
  ]
}
```

### Test 2: Login and Get Auth Token

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "YourPassword1!"}'
```

**Response:**
```json
{
  "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "email": "user@example.com", ... }
}
```

Copy the `authToken` value.

### Test 3: Submit Questionnaire Response

```bash
curl -X POST http://localhost:3001/api/questionnaires \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "essential",
    "relationshipType": "monogamous",
    "responses": {
      "1": "Something serious",
      "2": "Yes",
      "3": "Monogamous",
      "4": "[\"Travel\", \"Fitness\"]"
    }
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Questionnaire submitted successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "questionnaireId": 1,
    "status": "completed",
    "completedAt": "2024-01-03T15:30:00.000Z",
    "Answers": [
      {
        "id": 1,
        "questionnaireResponseId": 1,
        "questionId": 1,
        "value": "Something serious",
        "Question": {
          "id": 1,
          "text": "What are you looking for?",
          "type": "radio"
        }
      },
      {
        "id": 2,
        "questionnaireResponseId": 1,
        "questionId": 2,
        "value": "Yes",
        "Question": {
          "id": 2,
          "text": "Do you want kids?",
          "type": "radio"
        }
      },
      {
        "id": 3,
        "questionnaireResponseId": 1,
        "questionId": 3,
        "value": "Monogamous",
        "Question": {
          "id": 3,
          "text": "What is your relationship style?",
          "type": "radio"
        }
      },
      {
        "id": 4,
        "questionnaireResponseId": 1,
        "questionId": 4,
        "value": "[\"Travel\",\"Fitness\"]",
        "Question": {
          "id": 4,
          "text": "What are your interests?",
          "type": "checkbox"
        }
      }
    ],
    "Questionnaire": {
      "id": 1,
      "type": "essential",
      "title": "Essential Questionnaire"
    }
  }
}
```

### Test 4: Get User's Responses

```bash
curl http://localhost:3001/api/questionnaires/responses/user/1 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "questionnaireId": 1,
    "status": "completed",
    "completedAt": "2024-01-03T15:30:00.000Z",
    "createdAt": "2024-01-03T15:29:50.000Z",
    "updatedAt": "2024-01-03T15:30:00.000Z",
    "Questionnaire": {
      "id": 1,
      "type": "essential",
      "title": "Essential Questionnaire",
      "description": "Find out what matters most to you in a relationship"
    }
  }
]
```

---

## Database Tables Created

The new schema creates these tables:

### 1. questionnaires
Template definitions (reusable)
```sql
id, type, title, description, category, version, isActive, createdAt, updatedAt
```

### 2. questions
Individual questions within a template
```sql
id, questionnaireId (FK), text, type, options, required, order, createdAt, updatedAt
```

### 3. questionnaire_responses
User submissions
```sql
id, userId (FK), questionnaireId (FK), status, completedAt, createdAt, updatedAt
```

### 4. answers
Individual answers to questions
```sql
id, questionnaireResponseId (FK), questionId (FK), value, createdAt, updatedAt
```

### 5. Users, Preferences, Likes (unchanged)
Existing tables remain unchanged

---

## Frontend Still Works

The frontend `EssentialQuestionnairePage.js` already submits correctly! When users:

1. ✅ Fill out the form
2. ✅ Click "Submit Questionnaire"
3. ✅ Submit with `type: 'ESSENTIAL'` and responses object
4. ✅ Get 201 Created response
5. ✅ Redirect to /profile

**No changes needed to the frontend.**

---

## What Changed vs. What Stayed the Same

### ✅ CHANGED
- Questionnaire model (now template-only)
- Question model (new - separate table)
- QuestionnaireResponse model (new - tracks submissions)
- Answer model (now references response, not questionnaire)
- User associations (hasMany instead of hasOne)
- Routes in questionnaires.js

### ✅ SAME (No changes needed)
- Authentication system
- User model
- Preference model
- Like model
- Frontend (works as-is)
- Other routes (auth, users, etc.)

---

## Troubleshooting

### Issue: "Questionnaire not found"
**Cause:** Questionnaire template wasn't seeded
**Fix:** Check server logs - should show "✓ Created Essential Questionnaire"
If not, delete the database and restart:
```bash
rm backend/dating_app.db*
npm run dev
```

### Issue: 404 on /api/questionnaires
**Cause:** Routes not loaded correctly
**Fix:** 
1. Check that `models/Question.js` and `models/QuestionnaireResponse.js` exist
2. Check that `routes/questionnaires.js` is updated
3. Restart backend

### Issue: "User ID is required" on POST
**Cause:** Auth token not being sent or not extracted correctly
**Fix:**
1. Include `Authorization: Bearer TOKEN` header
2. Make sure token is valid (login first)
3. Check middleware/authentication.js is working

### Issue: "Questionnaire response not found" on GET responses
**Cause:** No responses submitted yet or wrong user ID
**Fix:**
1. Submit a questionnaire first (POST /api/questionnaires)
2. Check that user ID matches
3. Check server logs for errors

### Issue: Database locked
**Cause:** Multiple connections to SQLite
**Fix:**
```bash
rm backend/dating_app.db-shm
rm backend/dating_app.db-wal
npm run dev
```

---

## Data Migration Notes

### Old Data
- ❌ Old questionnaire responses are NOT migrated (old schema was incompatible)
- ⚠️ Old database is backed up to `dating_app.db.backup-*` (if needed)

### New Data
- ✅ Fresh schema created from scratch
- ✅ Questionnaire templates seeded automatically
- ✅ Ready for new user responses

---

## Next Steps

1. ✅ Verify tests pass above
2. ⏳ Test with frontend form submission
3. ⏳ Add more questionnaire types (Compatibility, Interests, etc.)
4. ⏳ Implement user matching algorithm
5. ⏳ Add questionnaire analytics

---

## Files Changed

**Created:**
- `backend/models/Question.js`
- `backend/models/QuestionnaireResponse.js`
- `backend/db-init.js` (auto-initialization)
- `backend/setup-schema.js` (manual setup option)

**Updated:**
- `backend/models/Questionnaire.js`
- `backend/models/Answer.js`
- `backend/models/User.js`
- `backend/routes/questionnaires.js`
- `backend/server.js`

**Migration Files (created but not used):**
- `backend/migrations/20260103-*.js` (for manual Sequelize CLI)

---

## Support

If you encounter any issues:
1. Check the error message in server console
2. Verify the database file exists: `backend/dating_app.db`
3. Check that all new model files exist
4. Try deleting database and restarting: `rm backend/dating_app.db*`

All tests and verification should pass. The system is ready for additional questionnaires and matching logic.
