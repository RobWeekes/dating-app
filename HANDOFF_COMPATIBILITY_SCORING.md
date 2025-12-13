# Handoff: Compatibility Scoring Algorithm Implementation

## Project Context

**Dating App** - A React/Node/Express application with authentication, user profiles, and matching features.

**Current Status:** 
- Authentication system ✓ Complete
- User profile with 7 new attributes ✓ Complete
- Questionnaire system exists (needs to verify current structure)
- Ready to implement personality scoring algorithm

---

## Task: Implement Compatibility Scoring Algorithm

### Phase 1: Personality Attribute Scoring (This Phase)

**Goal:** Create an algorithm that analyzes questionnaire responses and generates personality attribute scores that will be stored in the user model. These scores will later be used by a compatibility matching algorithm.

### Phase 2: Compatibility Matching Algorithm (Future)

**Goal:** Create a separate algorithm that uses the stored personality scores to calculate compatibility percentages between users.

---

## What Needs to Be Done - Phase 1

### 1. Analyze Current Questionnaire Structure
- [ ] Review `backend/models/Questionnaire.js` to understand current questionnaire responses
- [ ] Review `QUESTIONNAIRE_FEATURE.md` or similar docs to understand question categories
- [ ] Identify what personality/compatibility attributes should be scored
- [ ] List all questionnaire questions and their response types

### 2. Design Scoring Categories
Identify and define personality attribute categories that matter for compatibility matching. Examples (adjust based on actual questionnaire):
- Communication Style (Introverted → Extroverted scale)
- Life Goals (Career focused → Family focused scale)
- Adventure Level (Cautious → Risk-taking scale)
- Emotional Intelligence (Low → High scale)
- Relationship Readiness (Casual → Committed scale)
- Values Alignment (Individual → Traditional scale)
- etc.

Each category should have:
- Name (e.g., "Communication Style")
- Description
- Scale (0-100 or 1-10)
- Calculation logic based on questionnaire responses

### 3. Add Database Fields
- [ ] Create migration to add personality score columns to User model
  - Example fields: `communicationStyle`, `lifeGoals`, `adventureLevel`, etc.
  - Each field: DECIMAL(5, 2) to store 0-100 scores
  - Make all fields nullable initially

### 4. Create Scoring Service/Utility
- [ ] Create `backend/services/compatibilityScoring.js` with function:
  ```javascript
  calculatePersonalityScores(questionnaire, userResponses)
  // Input: questionnaire object and user's responses
  // Output: Object with all personality scores { communicationStyle: 75, lifeGoals: 82, ... }
  ```

### 5. Implement Scoring Logic
- [ ] For each personality attribute, create logic to:
  - Extract relevant question responses from questionnaire
  - Map responses to numerical scores (0-100)
  - Handle edge cases (unanswered questions, invalid responses)
  - Return consolidated score for that attribute

### 6. Update User Model
- [ ] Add personality score fields to User model
- [ ] Add method to recalculate scores: `User.updatePersonalityScores()`

### 7. Update Questionnaire Endpoints
- [ ] When user submits/updates questionnaire:
  - Calculate personality scores using new scoring service
  - Save scores to User model
  - Return calculated scores in response

### 8. Create Tests
- [ ] Create `backend/services/compatibilityScoring.test.js`
- [ ] Test scoring logic with sample questionnaire responses
- [ ] Verify scores are calculated correctly

---

## Key Files to Review/Update

### Backend Files
- `backend/models/Questionnaire.js` - Understand questionnaire structure
- `backend/models/User.js` - Will add personality score fields here
- `backend/routes/questionnaires.js` - POST/PUT endpoints that need to trigger scoring
- `backend/controllers/questionnaireController.js` (if exists)

### Create New Files
- `backend/services/compatibilityScoring.js` - Scoring algorithm
- `backend/services/compatibilityScoring.test.js` - Tests
- `backend/migrations/[timestamp]-add-personality-scores.js` - Database migration

### Documentation
- Update this handoff file with findings
- Document scoring categories and their calculation logic
- Create `COMPATIBILITY_SCORING_DOCUMENTATION.md` with algorithm details

---

## Current Questionnaire Information

To gather before starting:

```
Questions to answer:
1. What are the current questionnaire questions?
2. What are the response types? (multiple choice, scale, text, etc.)
3. How many personality attributes should be scored?
4. What's the range of scores? (0-100, 1-10, etc.)
5. Should all questions contribute to all scores, or specific questions to specific scores?
6. How to handle missing/unanswered questions?
7. Should scores be calculated immediately or asynchronously?
```

**Check these files:**
- `backend/models/Questionnaire.js`
- `backend/seeders/` - Look for questionnaire seeders
- `QUESTIONNAIRE_*.md` files in root directory
- `frontend/src/pages/Questionnaire.js` or similar

---

## Database Migration Plan

### Personality Score Columns to Add to Users Table

```sql
-- Tentative columns (adjust based on scoring categories)
ALTER TABLE users ADD COLUMN personalityScores JSON;
-- OR individual columns:
ALTER TABLE users ADD COLUMN communicationStyle DECIMAL(5,2);
ALTER TABLE users ADD COLUMN lifeGoals DECIMAL(5,2);
ALTER TABLE users ADD COLUMN adventureLevel DECIMAL(5,2);
-- ... etc
```

**Recommendation:** Use a single `personalityScores` JSON column to store all scores:
```javascript
{
  communicationStyle: 75,
  lifeGoals: 82,
  adventureLevel: 60,
  emotionalIntelligence: 88,
  // ... etc
}
```

This is more flexible and easier to update.

---

## Implementation Strategy

### Step 1: Discovery (30 min)
- Review questionnaire system
- Document current questions and structure
- Define scoring categories

### Step 2: Design (30 min)
- Design scoring algorithm
- Map questions to scores
- Define score ranges and calculations

### Step 3: Database (15 min)
- Create migration for personality scores storage

### Step 4: Scoring Service (1 hour)
- Implement `compatibilityScoring.js`
- Create calculation logic for each attribute
- Handle edge cases

### Step 5: Integration (45 min)
- Update User model
- Update questionnaire endpoints
- Trigger scoring when questionnaire is saved

### Step 6: Testing (30 min)
- Write unit tests
- Manual testing with real questionnaire responses
- Verify scores calculate correctly

### Step 7: Documentation (15 min)
- Document algorithm details
- Create examples of score calculations

**Total Estimated Time:** 3-4 hours

---

## Sample Scoring Categories (Template)

Adjust these based on actual questionnaire:

### 1. Communication Style (0-100)
- Questions: "How do you prefer to communicate?", "Are you introverted or extroverted?"
- Scoring: 0 = Very Introverted, 100 = Very Extroverted
- Calculation: Average of related question responses mapped to 0-100

### 2. Life Goals (0-100)
- Questions: "What are your priorities?", "Career or family?"
- Scoring: 0 = Family/Relationship focused, 100 = Career/Independence focused
- Calculation: Average of related question responses

### 3. Adventure Level (0-100)
- Questions: "How adventurous are you?", "Do you like trying new things?"
- Scoring: 0 = Very Cautious, 100 = Very Adventurous
- Calculation: Average of related question responses

### 4. Emotional Intelligence (0-100)
- Questions: "How do you handle emotions?", "Empathy level?"
- Scoring: 0 = Low EQ, 100 = High EQ
- Calculation: Average of related question responses

### 5. Relationship Readiness (0-100)
- Questions: "What type of relationship do you want?", "How soon?"
- Scoring: 0 = Casual/Not Ready, 100 = Serious/Very Ready
- Calculation: Average of related question responses

**Note:** These are examples - adjust based on actual questionnaire content.

---

## Expected Output Format

After implementation, when user completes/updates questionnaire:

**Saved to User model:**
```javascript
{
  id: 1,
  email: "user@example.com",
  // ... other user fields
  personalityScores: {
    communicationStyle: 72,
    lifeGoals: 85,
    adventureLevel: 68,
    emotionalIntelligence: 80,
    relationshipReadiness: 88,
    valuesAlignment: 76,
    // ... other scores
  },
  updatedAt: "2025-12-10T12:00:00Z"
}
```

**Returned in API response:**
```javascript
{
  message: "Questionnaire saved successfully",
  questionnaire: { /* ... */ },
  personalityScores: {
    communicationStyle: 72,
    lifeGoals: 85,
    // ... etc
  }
}
```

---

## Testing Approach

### Unit Tests
- Test individual scoring functions
- Test with various question responses
- Verify score calculations

### Integration Tests
- Test questionnaire endpoint with scoring
- Verify scores saved to User model
- Verify scores returned in API response

### Manual Testing
- Create test user
- Complete questionnaire
- Verify scores appear in profile
- Verify scores update when questionnaire is updated

---

## Questions to Ask in Next Session

1. What is the exact structure of the current questionnaire?
2. What questions are included?
3. How many personality attributes should we score?
4. What's the priority order if not all questions matter equally?
5. Should users be able to retake the questionnaire and update scores?
6. Should old scores be archived or overwritten?
7. Should scores be visible to users or only used internally for matching?

---

## Next Session Checklist

When starting the next session:
- [ ] Read this handoff document
- [ ] Review current questionnaire structure
- [ ] Document all questions and their types
- [ ] Design scoring categories
- [ ] Get approval on categories before coding
- [ ] Create database migration
- [ ] Implement scoring service
- [ ] Update questionnaire endpoints
- [ ] Write tests
- [ ] Document algorithm

---

## Status Summary

**What's Ready:**
- ✓ Authentication system
- ✓ User profile with new attributes
- ✓ Questionnaire system exists
- ✓ Database setup

**What's Next:**
- [ ] Design compatibility scoring algorithm
- [ ] Implement personality attribute scoring
- [ ] Store scores in user model
- [ ] Test with real questionnaire responses
- [ ] (Later) Implement compatibility matching algorithm

---

## Files to Reference

- `/backend/models/Questionnaire.js` - Questionnaire structure
- `/backend/models/User.js` - User model (will add score fields)
- `/backend/routes/questionnaires.js` - Questionnaire endpoints
- `/frontend/src/pages/Questionnaire.js` - Questionnaire UI
- `/QUESTIONNAIRE_*.md` files - Questionnaire documentation
- `/COMPATIBILITY_*.md` files - Compatibility documentation

---

## Notes for Next Session

- Make sure to understand the full questionnaire structure before designing scores
- Document the mapping between questions and scores clearly
- Consider edge cases like partial responses
- Test with various response patterns
- Keep scoring logic simple and maintainable
- Consider performance if recalculating scores frequently

Good luck! This is a foundational piece for the matching algorithm.
