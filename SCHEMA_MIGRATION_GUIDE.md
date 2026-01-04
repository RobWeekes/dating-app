# Schema Migration Guide

## Overview
This guide walks you through migrating from the old schema (where Questionnaire contained user responses) to the new schema (where Questionnaire is a template and QuestionnaireResponse tracks user submissions).

## What Changed

### ✅ New Models Created
- **Question** - Individual questions within a questionnaire template
- **QuestionnaireResponse** - Tracks when a user completes a questionnaire

### ✅ Models Updated
- **Questionnaire** - Now a template only (removed userId, interests, responses, etc.)
- **Answer** - Now references QuestionnaireResponse instead of Questionnaire
- **User** - Changed from hasOne(Questionnaire) to hasMany(QuestionnaireResponse)

## Migration Steps

### Step 1: Backup Your Database
```bash
cp backend/dating_app.db backend/dating_app.db.backup
```

### Step 2: Delete Old Database (Start Fresh)
Since the old schema was fundamentally incompatible, it's easiest to start fresh:

```bash
rm backend/dating_app.db
```

### Step 3: Run Migrations
Option A: Using Sequelize CLI (recommended)
```bash
cd backend
npm run migrate
```

Option B: Manual migration (if CLI fails)
```bash
node backend/run-migrations.js
```

### Step 4: Seed Initial Questionnaire Templates

You need to create the questionnaire templates before users can fill them out.

Create `backend/seeders/20260103-seed-questionnaires.js`:

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create Essential Questionnaire template
    const essentialQuestionnaire = await queryInterface.sequelize.models.Questionnaire.create({
      type: 'essential',
      title: 'Essential Questionnaire',
      description: 'Find out what matters most to you in a relationship',
      category: 'Essential',
      version: 1,
      isActive: true,
    });

    // Create questions for Essential Questionnaire
    const essentialQuestions = [
      {
        questionnaireId: essentialQuestionnaire.id,
        text: 'What are you looking for?',
        type: 'radio',
        options: ['Something serious', 'Casual dating', 'Not sure'],
        required: true,
        order: 1,
      },
      {
        questionnaireId: essentialQuestionnaire.id,
        text: 'Do you want kids?',
        type: 'radio',
        options: ['Yes', 'No', 'Maybe'],
        required: true,
        order: 2,
      },
      {
        questionnaireId: essentialQuestionnaire.id,
        text: 'What is your relationship style?',
        type: 'radio',
        options: ['Monogamous', 'Open relationship', 'Exploring options'],
        required: true,
        order: 3,
      },
      {
        questionnaireId: essentialQuestionnaire.id,
        text: 'What are your interests?',
        type: 'checkbox',
        options: ['Travel', 'Fitness', 'Art', 'Music', 'Cooking', 'Gaming', 'Reading', 'Sports'],
        required: false,
        order: 4,
      },
    ];

    await queryInterface.sequelize.models.Question.bulkCreate(essentialQuestions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.models.Questionnaire.destroy({ where: { type: 'essential' } });
  },
};
```

Run seeder:
```bash
cd backend
npm run seed
```

Or manually insert via SQL:
```sql
-- Create Essential Questionnaire
INSERT INTO Questionnaires (type, title, description, category, version, isActive, createdAt, updatedAt)
VALUES (
  'essential',
  'Essential Questionnaire',
  'Find out what matters most to you in a relationship',
  'Essential',
  1,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Get the ID (should be 1)
SELECT id FROM Questionnaires WHERE type = 'essential';

-- Create Questions (replace 1 with actual questionnaire ID if different)
INSERT INTO questions (questionnaireId, text, type, options, required, "order", createdAt, updatedAt)
VALUES
  (1, 'What are you looking for?', 'radio', '["Something serious", "Casual dating", "Not sure"]', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 'Do you want kids?', 'radio', '["Yes", "No", "Maybe"]', 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 'What is your relationship style?', 'radio', '["Monogamous", "Open relationship", "Exploring options"]', 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (1, 'What are your interests?', 'checkbox', '["Travel", "Fitness", "Art", "Music", "Cooking", "Gaming", "Reading", "Sports"]', 0, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
```

### Step 5: Test the New Schema

#### Test 1: Fetch questionnaire template
```bash
curl http://localhost:3001/api/questionnaires/1
```

Expected response:
```json
{
  "id": 1,
  "type": "essential",
  "title": "Essential Questionnaire",
  "description": "Find out what matters most to you in a relationship",
  "Questions": [
    {
      "id": 1,
      "text": "What are you looking for?",
      "type": "radio",
      "options": ["Something serious", "Casual dating", "Not sure"],
      "order": 1
    },
    ...
  ]
}
```

#### Test 2: Submit questionnaire (with auth token)
```bash
curl -X POST http://localhost:3001/api/questionnaires \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

Expected response:
```json
{
  "success": true,
  "message": "Questionnaire submitted successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "questionnaireId": 1,
    "status": "completed",
    "completedAt": "2024-01-03T...",
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
      ...
    ]
  }
}
```

#### Test 3: Get user's responses
```bash
curl http://localhost:3001/api/questionnaires/responses/user/1
```

### Step 6: Update Frontend

The frontend EssentialQuestionnairePage.js already submits correctly, but verify it's using the right endpoint:

```javascript
const response = await fetch('http://localhost:3001/api/questionnaires', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    type: 'ESSENTIAL',
    relationshipType: 'monogamous',
    responses: data,
  }),
});
```

## API Routes Summary

### Questionnaire Templates
- `GET /api/questionnaires` - List all questionnaires
- `GET /api/questionnaires/:id` - Get questionnaire by ID
- `GET /api/questionnaires/type/:type` - Get questionnaire by type

### User Responses
- `POST /api/questionnaires` - Submit a questionnaire (auth required)
- `GET /api/questionnaires/responses/user/:userId` - Get all user's responses
- `GET /api/questionnaires/responses/user/:userId/questionnaire/:questionnaireId` - Get specific response
- `PUT /api/questionnaires/:responseId` - Update a response
- `DELETE /api/questionnaires/:responseId` - Delete a response

### Answers
- `GET /api/questionnaires/:responseId/answers` - Get answers for a response
- `POST /api/questionnaires/:responseId/answers` - Add answer to response
- `PUT /api/questionnaires/answers/:answerId` - Update answer
- `DELETE /api/questionnaires/answers/:answerId` - Delete answer

## Common Issues

### Issue 1: "Questionnaire type not found"
**Solution:** Make sure you've seeded the questionnaire templates. Run the seed script or manually insert questionnaires.

### Issue 2: "User ID is required"
**Solution:** Make sure your auth token is valid and the middleware is extracting userId correctly.

### Issue 3: Foreign key constraint errors
**Solution:** Check that parent records exist:
- Questionnaire must exist for a given type
- Questions must have valid questionnaireId
- Answers must reference valid questionnaireResponseId and questionId

### Issue 4: Database locked
**Solution:** 
```bash
rm backend/dating_app.db-shm
rm backend/dating_app.db-wal
```

## Rollback (if needed)

```bash
# Undo last migration
npm run migrate:undo

# Undo all migrations
npm run migrate:undo:all

# Restore backup
cp backend/dating_app.db.backup backend/dating_app.db
```

## Next Steps

1. ✅ Models created and updated
2. ✅ Routes updated
3. ✅ Migrations created
4. ⏳ Run migrations and seed data
5. ⏳ Test the new schema
6. ⏳ Add more questionnaire types (Compatibility, Interests, etc.)
7. ⏳ Implement user matching based on answers

## Files Modified/Created

**Created:**
- `backend/models/Question.js`
- `backend/models/QuestionnaireResponse.js`
- `backend/migrations/20260103-create-questionnaire-response.js`
- `backend/migrations/20260103-create-questions.js`
- `backend/migrations/20260103-alter-questionnaires.js`
- `backend/migrations/20260103-alter-answers.js`
- `backend/run-migrations.js` (manual migration runner)

**Modified:**
- `backend/models/Questionnaire.js`
- `backend/models/Answer.js`
- `backend/models/User.js`
- `backend/routes/questionnaires.js`
