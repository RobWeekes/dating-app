# Immediate Action Checklist

## 🔴 Phase 1: Critical Fixes (Do First - 2 Hours)

### Fix 1: Scoring Weight Math Bug
**File**: `backend/services/MVPQuestionnaireScorer.js` → `calculateOverallScore()` (line 581)

**Current (Wrong)**:
- Main dimensions: 100% total weight
- Adjustment dimensions: +10% extra (110% total) ❌

**Action**:
- [ ] Verify weights sum to exactly 1.0
- [ ] Rebalance: Financial 20%→15%, Lifestyle 2.5%→3%, Work-Life 2.5%→1.5%, etc.
- [ ] Add weight validation function
- [ ] Test one score before/after

**Estimated time**: 30 minutes

---

### Fix 2: Cascade Penalty Multiplier Bug
**File**: `backend/services/MVPQuestionnaireScorer.js` → `calculateCompatibility()` (line 72)

**Current (Wrong)**:
```javascript
redFlags.forEach((flag) => {
  if (flag.severity === 'critical') {
    adjustedScore *= 0.7;  // Multiplies, don't add!
  }
});
```
Result: 2 critical flags = 51% score reduction (exponential) ❌

**Action**:
- [ ] Change from cascading multipliers to additive penalties
- [ ] Critical flag: -30 points (not ×0.7)
- [ ] Significant flag: -15 points
- [ ] Test with: 80 score + 2 critical flags = 20 score (not 39.2)

**Estimated time**: 45 minutes

---

### Fix 3: Input Validation
**File**: `backend/routes/mvp-scoring.js` → `POST /calculate` (line 19)

**Current (Wrong)**: Only checks if fields exist, not if they're valid ❌

**Action**:
- [ ] Add integer validation for userId1 and userId2
- [ ] Add check that users exist in database
- [ ] Add check that users have completed questionnaires
- [ ] Return specific error codes (not generic messages)

**Estimated time**: 45 minutes

---

## 🟠 Phase 2: Testing & Validation (Next 3-4 Hours)

### Create Test Suite
**File**: `backend/services/MVPQuestionnaireScorer.test.js` (new file)

**What to test**:
- [ ] Weight calculation validates to 1.0
- [ ] Score always returns 0-100
- [ ] Red flag detection catches critical cases
- [ ] String normalization is forgiving
- [ ] Handles missing data gracefully

**Tools**: Jest is already in package.json

**Estimated time**: 3-4 hours

---

### Test Data Scenarios
Create test cases for:
- [ ] Both users want children / both don't ✅ Match
- [ ] One wants children / one doesn't ❌ Red flag detected
- [ ] Extreme personality differences (opposites)
- [ ] Incomplete questionnaires
- [ ] Malformed responses

---

## 🟡 Phase 3: Data Quality (2-3 Hours)

### Add Unique Constraints
**File**: `backend/models/MVPQuestionnaireScore.js` (line 1)

**Action**:
- [ ] Prevent duplicate scores for same user pair
- [ ] Always store with minId/maxId (symmetric)
- [ ] Update routes to use normalized IDs

**Estimated time**: 1 hour

---

### Add Response Validation
**File**: `backend/services/MVPQuestionnaireScorer.js` (new function)

**Create function**: `validateMVPQuestionnaire(responses)`
- [ ] Check all 50 questions present and answered
- [ ] Check answer formats are valid (type, range)
- [ ] Log missing/invalid answers
- [ ] Return errors array

**Estimated time**: 1-2 hours

---

## 📚 Phase 4: Documentation (2-3 Hours)

### Reorganize Repo Docs
**Action**:
- [ ] Create `/docs` folder
- [ ] Move setup to `docs/SETUP.md`
- [ ] Move scoring info to `docs/SCORING_GUIDE.md`
- [ ] Archive 40+ root files

**Result**:
```
/docs
  ├── SETUP.md (definitive start point)
  ├── SCORING_GUIDE.md (algorithm explanation)
  ├── API_REFERENCE.md (all endpoints)
  ├── TESTING.md (how to verify)
  └── TROUBLESHOOTING.md (common issues)
```

**Estimated time**: 2-3 hours

---

### Document Algorithm Assumptions
**File**: `docs/SCORING_GUIDE.md` (new section)

**Document**:
- [ ] Why Big Five personality
- [ ] Why 50% questions score
- [ ] What "critical" vs "significant" means
- [ ] How age/location filtering works
- [ ] Edge cases and limitations

---

## 🧪 Phase 5: Deploy with Confidence

### Pre-Production Checklist
- [ ] All tests passing
- [ ] Weight math verified
- [ ] Penalty logic tested
- [ ] Input validation active
- [ ] Duplicate prevention working
- [ ] Rate limiting configured
- [ ] Error messages improved

---

## Quick Test Commands

```bash
# Run tests
cd backend
npm test

# Test scoring calculation
curl -X POST http://localhost:3001/api/mvp-scoring/calculate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId1": 1, "userId2": 2}'

# Expected response:
{
  "personalityScore": 75,
  "valuesScore": 82,
  "...": "...",
  "overallCompatibilityScore": 78,
  "matchRating": 4,
  "redFlags": []
}
```

---

## Estimated Total Time
- Phase 1 (Critical): **2 hours**
- Phase 2 (Testing): **3-4 hours**
- Phase 3 (Data quality): **2-3 hours**
- Phase 4 (Documentation): **2-3 hours**
- **Total: ~9-12 hours** to production-ready

---

## Success Criteria

✅ All scores validate: 0 ≤ score ≤ 100
✅ Weight math correct: Σ weights = 1.0
✅ Penalty logic sensible: 1-2 flags doesn't destroy score
✅ Tests passing: >90% coverage on scoring logic
✅ Docs clear: New dev can understand algorithm in 15 minutes
✅ Validation strict: Bad data caught before scoring
✅ Data clean: No duplicate scores, all responses valid
