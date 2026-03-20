# MVP Questionnaire Scoring Implementation

**Status**: ✅ COMPLETE
**Date**: January 31, 2026

## Overview

Implemented automatic MVP compatibility scoring that triggers when users submit their MVP questionnaire responses. The system calculates bidirectional compatibility scores between all users who have completed the MVP questionnaire.

## What Was Implemented

### 1. **Automatic Score Calculation**

- When a user submits/updates their MVP questionnaire, the system automatically:
  - Identifies all other users who completed the MVP questionnaire
  - Calculates compatibility score for each pair using MVPQuestionnaireScorer
  - Stores/updates scores in MVPQuestionnaireScore table

### 2. **Bidirectional Scoring**

- Scores are calculated in both directions (userId1→userId2 and userId2→userId1)
- Ensures matches are discoverable from both user perspectives
- Supports efficient querying from either user's standpoint

### 3. **Backend Changes**

#### File: `backend/routes/questionnaires.js`

**Added Imports:**

```javascript
const MVPQuestionnaireScore = require("../models").MVPQuestionnaireScore;
const MVPQuestionnaireScorer = require("../services/MVPQuestionnaireScorer");
```

**Added Helper Function:**

```javascript
async function calculateMVPScoresForUser(userId, questionnaireId)
```

This function:

- Validates that the questionnaire is type 'MVP'
- Finds all other completed MVP questionnaire responses
- Calculates compatibility scores using MVPQuestionnaireScorer.calculateCompatibility()
- Stores or updates scores in MVP_Questionnaire_Scores table
- Creates bidirectional score entries
- Includes comprehensive logging for debugging

**Updated POST Endpoint:**

```javascript
// Trigger MVP score calculation in background if this is MVP questionnaire
if (type === "MVP") {
  calculateMVPScoresForUser(userId, questionnaire.id).catch((err) => {
    console.error("Background scoring error:", err);
  });
}
```

### 4. **Score Data Stored**

Each MVPQuestionnaireScore record contains:

- `userId1`: First user ID
- `userId2`: Second user ID
- `personalityScore`: Personality dimension (0-100)
- `valuesScore`: Core values dimension (0-100)
- `familyScore`: Family planning dimension (0-100)
- `financialScore`: Financial attitudes dimension (0-100)
- `lifestyleScore`: Lifestyle preferences (0-100)
- `workLifeScore`: Work-life balance (0-100)
- `healthScore`: Health & wellness (0-100)
- `physicalScore`: Physical preferences (0-100)
- `overallCompatibilityScore`: Weighted overall score (0-100)
- `matchRating`: Star rating (1-5)
- `redFlags`: JSON array of compatibility concerns
- `incompatibilityReasons`: JSON array of mismatch explanations

### 5. **Scoring Weights**

The MVPQuestionnaireScorer uses these weights:

- **Personality**: 25%
- **Core Values**: 30%
- **Family Planning**: 25%
- **Financial Attitudes**: 20%
- **Lifestyle**: 5% (adjustment)
- **Work-Life Balance**: 5% (adjustment)
- **Health & Wellness**: 2.5% (adjustment)
- **Physical Preferences**: 2.5% (adjustment)

### 6. **Red Flag Detection**

The scorer automatically detects critical incompatibilities:

- **Family Planning Mismatch**: One wants children, other doesn't
- **Monogamy Mismatch**: One wants monogamy, other open to non-monogamy
- **Financial Extremes**: Significant differences in financial attitudes
- **Cleanliness Extremes**: Very different cleanliness preferences

Critical red flags penalize the overall score by 30% each.

## How It Works (User Flow)

1. **User Completes MVP Questionnaire**
   - Fills out all 50 questions across 8 sections
   - Clicks "Submit" on final section

2. **Backend Receives Submission**
   - `/api/questionnaires` POST endpoint handles submission
   - Creates/updates QuestionnaireResponse record
   - Stores 50 answers in Answer table

3. **Automatic Scoring Triggered**
   - System detects this is MVP questionnaire type
   - Calls `calculateMVPScoresForUser(userId, questionnaireId)`
   - Runs in background (doesn't block response)

4. **Score Calculation Process**
   - Finds all other users with completed MVP responses
   - For each user pair:
     - Fetches both users' answers
     - Runs MVPQuestionnaireScorer.calculateCompatibility()
     - Stores or updates score in database
     - Creates reverse score for bidirectional lookup

5. **Scores Available for Matching**
   - Scores stored and ready for `/matches` page queries
   - Can sort by compatibility, view red flags, etc.

## API Endpoints Available

### Get User's Matches (Ready for Next Phase)

```
GET /api/mvp-scoring/matches/:userId
```

Returns all calculated matches sorted by compatibility score

### Get Specific Compatibility Score

```
GET /api/mvp-scoring/:userId1/:userId2
```

Returns detailed compatibility breakdown

### Get Top Matches

```
GET /api/mvp-scoring/top-matches/:userId?limit=10
```

Returns highest compatibility matches

## Error Handling

- If one user hasn't completed MVP questionnaire: Gracefully skips scoring
- If scoring fails for a pair: Logs error and continues with other pairs
- Scoring runs in background: Doesn't block questionnaire submission response
- Comprehensive logging: Shows score calculations with emojis for clarity

## Console Output Example

```
📊 Starting MVP score calculation for user 1
Found 3 other users with completed MVP questionnaires
✅ Calculated score: 1 <-> 2: 78
  📝 Updated existing score
✅ Calculated score: 1 <-> 3: 62
  ➕ Created new score
✅ Calculated score: 1 <-> 4: 85
  📝 Updated existing score
✨ MVP score calculation completed for user 1
```

## Testing

To test this implementation:

1. **Create Multiple Test Users**
   - User 1: Complete MVP questionnaire
   - User 2: Complete MVP questionnaire
   - Check console logs for score calculation

2. **Verify Database**
   - Query `MVP_Questionnaire_Scores` table
   - Confirm scores exist for user pairs
   - Verify bidirectional entries (userId1→userId2 and userId2→userId1)

3. **Check Logging**
   - Monitor backend console during submission
   - Should see "Starting MVP score calculation" log
   - Should see "Calculated score" entries for each pairing

## Next Steps

Now that scores are being calculated, the next phase is to:

1. **Build the `/matches` page**
   - Query MVPQuestionnaireScore table
   - Display matches sorted by compatibility
   - Show score breakdown, red flags, user profiles

2. **Add Match Details Page**
   - Side-by-side dimensional comparison
   - Compatibility breakdown visualization
   - Red flag indicators

3. **Optional Enhancements**
   - Real-time score recalculation when users update questionnaire
   - Score filters (show only 70+ compatibility, no red flags, etc.)
   - Score history/tracking
   - Mutual matches only (both users interested)

## Database Impact

- New scores created in `MVP_Questionnaire_Scores` table
- One score record per user pair (bidirectional)
- Typically adds 1 record per other user when questionnaire submitted
- With N users: Each new submission creates N-1 new score records

## Performance Notes

- Scoring runs asynchronously in background
- Doesn't block questionnaire submission response
- O(N) complexity: Each submission calculates N-1 scores
- With 10 users: ~9 scores per submission
- With 100 users: ~99 scores per submission
- Future optimization: Could queue/batch score calculations
