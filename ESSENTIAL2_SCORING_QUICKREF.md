# Essential Questionnaire 2 - Developer Quick Reference

## Files Overview

### Configuration
- **`essential2-scoring-config.js`** (550 lines)
  - INDICES: 20 relationship compatibility indices with names and importance weights
  - QUESTION_INDEX_MAPPINGS: Maps 29 questions to 20 indices with response deltas
  - WEIGHT_MULTIPLIERS: Converts text weights (strong/medium/weak) to numeric values
  - INDEX_IMPORTANCE: Maps critical/high/medium/low to numeric importance weights

### Scoring Engine
- **`essential2-scoring-engine.js`** (450+ lines)
  - `Essential2Scorer` class - Main scoring engine
  - `scoreResponses(responses)` - Core method
  - `detectBiases()` - Identifies social desirability, acquiescence, consistency issues
  - `createResponseVector()` - Creates 35D vector for ANN matching
  - `createCategoryScores()` - User-facing category aggregation (7 categories)

### Matching Engine
- **`compatibility-matcher.js`** (400+ lines)
  - `CompatibilityMatcher` class - User matching engine
  - `computeCompatibility()` - Overall compatibility score
  - `computeDirectionalCompatibility()` - One-way compatibility (A→B or B→A)
  - `identifyDealbreakers()` - Critical mismatch detection
  - `assessRisks()` - Relationship risk assessment
  - `batchComputeCompatibility()` - Vectorized pair matching

### Documentation
- **`ESSENTIAL2_SCORING_SYSTEM.md`** (600+ lines)
  - Complete system documentation
  - Architecture diagrams
  - Scoring algorithms
  - Bias detection methods
  - Scalability approach
  - Implementation examples

### Testing
- **`essential2-scoring.test.js`** (350+ lines)
  - Comprehensive test suite
  - Test secure user scoring
  - Test anxious user scoring
  - Test bias detection
  - Test compatibility matching
  - Test vector dimensions

## Quick Start

### 1. Score a Single User

```javascript
const Essential2Scorer = require('./essential2-scoring-engine');
const scorer = new Essential2Scorer();

const responses = {
  1: 'Check in and try to understand',
  2: 'Offer reassurance even if it takes effort',
  // ... all 29 questions
};

const result = scorer.scoreResponses(responses);

// Result structure:
{
  indices: {
    AA: 0.38,  // Attachment Anxiety (0-1)
    AV: 0.42,  // Attachment Avoidance
    ER: 0.61,  // Emotional Regulation
    // ... all 20 indices
  },
  vector: Float32Array(35),  // For ANN indexing
  consistency: 0.95,         // Bias detection score
  biasFlags: {
    socialDesirabilityBias: false,
    acquiescenceBias: false,
    lowConsistency: false,
    extremeResponses: false
  },
  metadata: {
    respondedQuestions: 29,
    totalQuestions: 29,
    patterns: { /* ... */ },
    timestamp: '2025-03-25T...'
  }
}
```

### 2. Match Two Users

```javascript
const CompatibilityMatcher = require('./compatibility-matcher');
const matcher = new CompatibilityMatcher();

const userAScores = result1.indices;
const userBScores = result2.indices;

const compatibility = matcher.computeCompatibility(userAScores, userBScores);

// Result structure:
{
  overallCompatibility: 0.768,      // 0-1 range
  directional: {
    aToB: 0.768,                    // User A's view of fit
    bToA: 0.768                     // User B's view of fit
  },
  byCategory: {                      // 20 index-level scores
    AA: { aToB, bToA, overall },
    AV: { aToB, bToA, overall },
    // ... all 20 indices
  },
  dealbreakers: [                    // Critical mismatches
    {
      name: 'Communication Style Mismatch',
      index: 'CD',
      userAScore: 0.65,
      userBScore: 0.35,
      severity: 'low'
    }
  ],
  riskFactors: {                     // Relationship risks
    riskCount: 1,
    hasHighRisk: false,
    risks: [/* ... */]
  },
  summary: 'Excellent compatibility'
}
```

### 3. Get Category Scores

```javascript
const categories = scorer.createCategoryScores(result.indices);

// Result:
{
  attachment: {
    name: 'Attachment & Security',
    score: 0.493,      // 0-1
    weight: 1.0,
    weighted: 0.493
  },
  conflict: {
    name: 'Conflict & Repair',
    score: 0.584,
    weight: 1.0,
    weighted: 0.584
  },
  intimacy: {
    name: 'Intimacy & Closeness',
    score: 0.541,
    weight: 0.9,
    weighted: 0.487
  },
  communication: { /* ... */ },
  trust: { /* ... */ },
  investment: { /* ... */ },
  values: { /* ... */ }
}
```

## Integration Points

### Backend API
1. **POST /api/questionnaires/responses** - Store user responses
   - Call `scorer.scoreResponses()` after storing
   - Store result.vector in vector database
   - Cache result.indices for quick matching

2. **GET /api/matches** - Retrieve compatible matches
   - Query ANN index with user's vector
   - Compute compatibility with top-k candidates
   - Return sorted list with summaries

### Database Schema
```sql
-- Store raw responses (optional)
QuestionnaireResponse {
  userId, questionId, questionnaireType, answerText, ...
}

-- Store computed scores
QuestionnaireScore {
  userId, questionnaireType,
  vector (BLOB 35D),           -- For ANN
  indices (JSON),              -- All 20 indices
  category_scores (JSON),      -- 7 categories
  consistency, biasFlags,
  computed_at
}

-- Store compatibility results (optional cache)
CompatibilityScore {
  userId1, userId2,
  overallScore, dealbreakers, risks,
  computed_at
}
```

### ANN Integration
```javascript
const faiss = require('faiss.js');

// Build index once daily
const index = new faiss.IndexFlatL2(20);  // 20D core vector
const vectors = users.map(u => u.score.vector.slice(0, 20));
index.add(vectors);
index.save('scores.index');

// Query: find top matches for user
const [distances, ids] = index.search(userVector, k=1000);

// Compute detailed compatibility for top results
const detailedMatches = ids.slice(0, 100).map(id => {
  return matcher.computeCompatibility(userScores, candidates[id].scores);
});
```

## Key Concepts

### 20 Relationship Indices

**Critical (Weight 1.0):**
- AA: Attachment Anxiety - worry/protest behavior
- AV: Attachment Avoidance - withdrawal/independence
- ER: Emotional Regulation - handle stress calmly
- CE: Conflict Engagement - address disagreement directly
- CR: Conflict Repair - reconnect after conflict
- NC: Negative Conflict Style - criticize/defend/contempt
- ES: Emotional Stability - mood swings vs steady
- LT: Long-Term Orientation - relationship goals
- LS: Life Structure - clarity on life decisions

**High (Weight 0.8):**
- RS: Responsiveness - meet partner's emotional needs
- ER2: Emotional Responsibility - own vs blame reactions
- CA: Closeness-Autonomy - prefer together vs separate
- CT: Closeness Tolerance - endure sustained intimacy
- CD: Communication Directness - explicit vs implied
- MR: Mind-Reading Expectation - intuition vs clarity
- JS: Jealousy/Threat Sensitivity - trust or suspicious
- EN: Effort & Investment - show commitment consistently
- CO: Conscientiousness - reliable, dependable
- AG: Assertiveness-Agreeableness - speak up vs keep peace
- NS: Novelty vs Stability - change vs routine

### Bias Detection Methods

1. **Social Desirability Bias** - Too many ideal answers
   - Trigger: >3 positive traits high + >2 negative traits low
   - Adjustment: -0.15 consistency

2. **Acquiescence Bias** - Always choosing same position
   - Trigger: >65% same option pattern
   - Adjustment: -0.10 consistency

3. **Low Consistency** - Contradictory responses
   - Trigger: Related items disagree (AA & AV both high)
   - Adjustment: -0.10 per violation

4. **Extreme Responses** - All-or-nothing answers
   - Trigger: >12 indices with scores < 0.2 or > 0.8
   - Adjustment: -0.05 consistency

### Compatibility Formula

**Per-question (three-weight system):**
```
match_score = indicator(partner_answer ∈ user_tolerance) × importance_weight
```

**Directional (A's perspective of B):**
```
compatibility(A→B) = Σ_i importance_i × similarity_i / Σ_i importance_i
where similarity = 1 - |user_A_score_i - user_B_score_i|
```

**Overall (bidirectional):**
```
overall = √(compatibility(A→B) × compatibility(B→A))
```

## Performance Targets

| Operation | Time | Memory |
|-----------|------|--------|
| Score 1 user | 5-10ms | 140 bytes |
| Detect bias | 2ms | Inline |
| Match 1 pair | 0.5-1ms | 200 bytes |
| Query top-100 (ANN) | <100ms | N/A |
| Batch score 1000 users | 5-10s | ~140KB |

## Debugging

### Enable Logging
```javascript
// In scoring-engine.js, uncomment debug logs:
console.log(`Processing Q${questionId}: ${answerText}`);
console.log(`  Contrib:`, responseMapping);
```

### Inspect Bias Flags
```javascript
if (result.consistency < 0.85) {
  console.log('Low consistency:', result.biasFlags);
  // Check which bias is primary
}
```

### Validate Vector
```javascript
// Vector should have:
// - 35 dimensions (Float32Array)
// - First 20 values between 0-1 (index scores)
// - Index 20 between 0-1 (consistency)
// - Indices 21-24 are 0 or 1 (flags)
// - Indices 25-34 between 0-1 (risk scores)

if (vector.length !== 35) throw new Error('Invalid vector size');
```

### Test Compatibility Edge Cases
```javascript
// Perfect match
const compat1 = matcher.computeCompatibility(scores, scores);
console.assert(compat1.overallCompatibility > 0.99);

// Complete mismatch
const oppScores = {};
for (const k of Object.keys(scores)) {
  oppScores[k] = 1 - scores[k];
}
const compat2 = matcher.computeCompatibility(scores, oppScores);
console.assert(compat2.overallCompatibility < 0.1);
```

## Common Issues

### Issue: Consistency Score Always 100%
- **Cause**: No actual biases detected in test data
- **Solution**: Use realistic responses with patterns

### Issue: Dealbreakers Not Detected
- **Cause**: Threshold not exceeded (need |Δ| > 0.5-0.6)
- **Solution**: Create test pairs with extreme differences

### Issue: Wrong Index Scores
- **Cause**: Response not in mapping or mapping error
- **Solution**: Check question ID and answer text match exactly

### Issue: Vector Dimensions Wrong
- **Cause**: Code change to scoring algorithm
- **Solution**: Verify expected 35D, adjust if indices changed

## Roadmap

### Phase 1 (Complete)
- ✅ 20 index definitions
- ✅ 29 questions with response mappings
- ✅ Bias detection (4 types)
- ✅ Vector encoding
- ✅ Compatibility matching
- ✅ Category scoring

### Phase 2 (Future)
- ⏳ Three-weight system (importance, acceptable answers)
- ⏳ Temporal tracking (score evolution)
- ⏳ Machine learning (weight optimization)
- ⏳ Behavioral signals (response timing, skip patterns)
- ⏳ Gender/sexuality conditional indexing
- ⏳ Confidence intervals on scores

### Phase 3 (Future)
- ⏳ Embeddings (autoencoder dimensionality reduction)
- ⏳ Graph-based matching (network effects)
- ⏳ Feedback loop (match success rate tracking)
- ⏳ Adversarial robustness (game-proof scoring)
- ⏳ Multi-language support
- ⏳ Real-time score updates during questionnaire
