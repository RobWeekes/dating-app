# Schema Compatibility Report

## Summary
Your current Sequelize models and database are **INCOMPATIBLE** with the proper schema design. The current implementation conflates two different concepts into one table, making it impossible to implement the many-to-many relationship needed for multiple questionnaires per user.

---

## Current Implementation (❌ WRONG)

```
User (1) ──hasOne──> Questionnaire (1)
                          │
                        (1:M)
                          │
                          v
                        Answer (M)
```

**Problem:** User.hasOne(Questionnaire) means each user can only have ONE questionnaire record ever. The Questionnaire table conflates:
- The questionnaire TEMPLATE (what questions exist)
- The user's RESPONSE (their answers)

This is why you have issues:
- Can't have multiple questionnaires per user
- Can't reuse the same questionnaire for multiple users
- Can't store question definitions separately
- Current schema stores responses as JSON blob, not structured data

---

## Correct Schema (✅ SHOULD BE)

```
User (1) ──hasMany──> QuestionnaireResponse (M)
                            │
                          (1:M)
                            │
                            v
                          Answer (M)

Questionnaire (1) ──hasMany──> Question (M)
       │                            │
       │                            v
       └──hasMany──> QuestionnaireResponse (M)
```

**This allows:**
- Multiple questionnaires per user
- Multiple users per questionnaire
- Questions are defined once, reused many times
- Responses are tracked separately

---

## Current Models vs. Required Models

### ✅ User Model
**Status:** Correct
**Issues:** Association is wrong (hasOne instead of hasMany to QuestionnaireResponse)

```javascript
// CURRENT (wrong)
User.hasOne(models.Questionnaire, { foreignKey: 'userId' });

// SHOULD BE (correct)
User.hasMany(models.QuestionnaireResponse, { foreignKey: 'userId' });
```

---

### ❌ Questionnaire Model (CONFLATES TWO CONCEPTS)
**Status:** Needs major refactor

**Current problems:**
- `userId` field makes it a user-specific record (should be questionnaire template only)
- Stores responses as JSON blob in `responses` field
- `interests`, `datingGoal`, `relationshipType` are user-specific, not template-specific
- Can't support multiple questionnaires per user
- Can't share questionnaire across users

**Current schema:**
```javascript
{
  id, userId, questionnaire, interests, datingGoal, 
  relationshipType, responses, createdAt, updatedAt
}
```

**Required schema (split into 2 models):**

#### Model 1: Questionnaire (template)
```javascript
{
  id,           // Primary key
  type,         // 'essential', 'compatibility', 'interests', etc.
  title,        // "Essential Questionnaire"
  description,  // Longer description
  category,     // For organization
  version,      // Track changes over time
  isActive,     // Toggle on/off
  createdAt,
  updatedAt
}
```

#### Model 2: QuestionnaireResponse (user submission)
```javascript
{
  id,                    // Primary key
  userId,                // FK to User
  questionnaireId,       // FK to Questionnaire (template)
  status,                // 'in_progress', 'completed'
  completedAt,           // When did user finish?
  createdAt,
  updatedAt
}
```

---

### ❌ Answer Model (WRONG FOREIGN KEY)
**Status:** Needs refactoring

**Current problem:**
- References `questionnaireId` (a user's response) ✓ Good
- But should reference `QuestionnaireResponseId` instead ✗ Wrong
- `questionId` is STRING but should be INTEGER ✗
- No reference to the actual Question model

**Current schema:**
```javascript
{
  id, questionnaireId, questionId, answer, createdAt, updatedAt
}
```

**Required schema:**
```javascript
{
  id,                          // Primary key
  questionnaireResponseId,     // FK to QuestionnaireResponse
  questionId,                  // FK to Question
  value,                       // The answer (text/number/json)
  createdAt,
  updatedAt
}
```

---

### ❌ MISSING: Question Model
**Status:** Does not exist - MUST CREATE

This model defines the questions within each questionnaire template.

```javascript
{
  id,                    // Primary key
  questionnaireId,       // FK to Questionnaire (which template?)
  text,                  // "What are you looking for?"
  type,                  // 'text', 'radio', 'checkbox', 'slider'
  options,               // JSON array: ["Option 1", "Option 2", ...]
  required,              // boolean
  order,                 // Display order within questionnaire
  createdAt,
  updatedAt
}
```

---

## Migration Path (What to Fix)

### STEP 1: Create Question Model
Create `backend/models/Question.js`:
```javascript
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'questionnaires', key: 'id' }
      },
      text: { type: DataTypes.TEXT, allowNull: false },
      type: {
        type: DataTypes.ENUM('text', 'radio', 'checkbox', 'slider'),
        defaultValue: 'text'
      },
      options: { type: DataTypes.JSON, defaultValue: [] },
      required: { type: DataTypes.BOOLEAN, defaultValue: true },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    { tableName: 'questions', timestamps: true }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.Questionnaire, { foreignKey: 'questionnaireId' });
  };

  return Question;
};
```

---

### STEP 2: Create QuestionnaireResponse Model
Create `backend/models/QuestionnaireResponse.js`:
```javascript
module.exports = (sequelize, DataTypes) => {
  const QuestionnaireResponse = sequelize.define(
    'QuestionnaireResponse',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'questionnaires', key: 'id' }
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed'),
        defaultValue: 'in_progress'
      },
      completedAt: { type: DataTypes.DATE },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    },
    { tableName: 'questionnaire_responses', timestamps: true }
  );

  QuestionnaireResponse.associate = (models) => {
    QuestionnaireResponse.belongsTo(models.User, { foreignKey: 'userId' });
    QuestionnaireResponse.belongsTo(models.Questionnaire, { foreignKey: 'questionnaireId' });
    QuestionnaireResponse.hasMany(models.Answer, { foreignKey: 'questionnaireResponseId' });
  };

  return QuestionnaireResponse;
};
```

---

### STEP 3: Update Questionnaire Model
Remove user-specific fields:
```javascript
// Remove: userId, interests, datingGoal, relationshipType, responses
// Add: type, title, description, category, version, isActive

{
  id, type, title, description, category, version, isActive, createdAt, updatedAt
}
```

---

### STEP 4: Update Answer Model
Change foreign key and add question reference:
```javascript
// OLD: questionnaireId (wrong!)
// NEW: questionnaireResponseId (correct!)

{
  id,
  questionnaireResponseId,  // NOT questionnaireId
  questionId,               // Reference to actual Question
  value,                    // NOT "answer"
  createdAt,
  updatedAt
}
```

---

### STEP 5: Update User Model
Change association from hasOne to hasMany:
```javascript
// OLD: User.hasOne(models.Questionnaire, { foreignKey: 'userId' })
// NEW: User.hasMany(models.QuestionnaireResponse, { foreignKey: 'userId' })
```

---

### STEP 6: Create Migrations
```
Create migration: Create QuestionnaireResponse table
Create migration: Create Question table
Alter migration: Remove userId from Questionnaires
Alter migration: Remove interests, datingGoal, etc. from Questionnaires
Alter migration: Change Answer.questionnaireId to Answer.questionnaireResponseId
```

---

## Routes Affected by Changes

| Route | Current | Issue | Fix |
|-------|---------|-------|-----|
| `POST /api/questionnaires` | Creates Questionnaire | Creates user-specific record | Should create QuestionnaireResponse |
| `GET /api/questionnaires/:id` | Gets one user's response | Mixed template + response data | Should get template OR response separately |
| `GET /api/questionnaires/user/:userId` | Gets user's response | Wrong table reference | Use QuestionnaireResponse table |
| `POST /api/questionnaires/:id/answers` | Creates Answer | References wrong questionnaire | Reference QuestionnaireResponseId |

---

## Current Data Issues

Your current database (dating_app.db) has data stored in the wrong schema. After creating new tables:

1. **Backup current data**
2. **Create new QuestionnaireResponse and Question tables** (migrations)
3. **Migrate data** from old Questionnaire table to new structure
4. **Update routes** to use new models
5. **Test thoroughly** before deploying

---

## Validation

### ✅ Working Now
- User authentication
- Token-based API calls
- Form submission saves to database

### ❌ Not Working as Designed
- Multiple questionnaires per user (blocked by hasOne)
- Questionnaire templates (conflated with responses)
- Proper answer tracking (JSON blobs instead of structured data)
- Matching users by questionnaire answers (requires proper schema)

---

## Timeline Estimate

| Task | Time | Priority |
|------|------|----------|
| Create Question model | 15 min | HIGH |
| Create QuestionnaireResponse model | 15 min | HIGH |
| Create migrations | 30 min | HIGH |
| Update Answer model | 10 min | HIGH |
| Update Questionnaire model | 10 min | HIGH |
| Update routes (questionnaires.js) | 45 min | HIGH |
| Data migration script | 30 min | MEDIUM |
| Testing | 30 min | HIGH |
| **Total** | **~3 hours** | |

---

## Recommendation

**Implement this refactoring NOW** before adding more questionnaires. The longer you wait, the more data and code you'll have to migrate.

The fix is straightforward:
1. Split Questionnaire into Questionnaire (template) + QuestionnaireResponse (user submission)
2. Create Question model for storing questionnaire questions
3. Update Answer to reference QuestionnaireResponse instead of Questionnaire
4. Run migrations
5. Update routes

Once done, your system will properly support:
- Essential Questionnaire ✓
- Compatibility Questionnaire ✓
- Future questionnaires (Interests, Values, etc.) ✓
- User matching based on answers ✓
