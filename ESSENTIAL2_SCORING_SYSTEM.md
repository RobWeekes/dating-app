# Essential Questionnaire 2 - Scoring System

## Overview

A vectorized, scalable scoring system for the Essential Questionnaire 2 that:

- Maps 29 questions to 20 relationship compatibility indices
- Detects and adjusts for response biases
- Computes user compatibility scores
- Supports efficient matching for tens of millions of users using ANN indexing

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                    User Questionnaire Responses                 │
│               (29 questions × 3 answer options each)             │
└─────────────────────────────────────────────────────┬───────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│         Essential2Scorer - Response Processing Engine           │
│  • Parse and validate responses                                 │
│  • Map answers to index contributions                           │
│  • Calculate raw index scores                                  │
│  • Detect response biases                                      │
│  • Create response vector (35 dimensions)                      │
└─────────────────────────────────────────────────────┬───────────┘
                                                      │
                        ┌─────────────────────────────┼─────────────────────────┐
                        │                             │                         │
                        ▼                             ▼                         ▼
            ┌─────────────────────┐    ┌──────────────────────┐   ┌──────────────────────┐
            │  Index Scores       │    │  Bias Detection      │   │  Response Vector     │
            │  (20 dimensions)    │    │  (Consistency score, │   │  (35 dimensions)     │
            │                     │    │   Social desirability│   │                      │
            │  AA, AV, ER, RS, .. │    │   Acquiescence)      │   │  For ANN indexing &  │
            │  (all 0-1 range)    │    │                      │   │  matching            │
            └─────────────────────┘    └──────────────────────┘   └──────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│      CompatibilityMatcher - User Matching Engine               │
│  • Compute directional compatibility (A→B, B→A)               │
│  • Generate overall compatibility score                        │
│  • Identify dealbreakers and risk factors                      │
│  • Create compatibility vectors for retrieval                  │
└─────────────────────────────────────────────────────┬───────────┘
                                                      │
                                ┌─────────────────────┼──────────────────┐
                                │                     │                  │
                                ▼                     ▼                  ▼
                    ┌────────────────────┐  ┌──────────────────┐  ┌────────────────┐
                    │ Compatibility Score│  │  Dealbreakers    │  │  Risk Factors  │
                    │ (0-1 range)        │  │  & Concerns      │  │                │
                    │                    │  │                  │  │  Categorized   │
                    │ Geometric mean of  │  │  • Life goals    │  │  risks for     │
                    │ A→B and B→A scores │  │  • Attachment    │  │  prediction    │
                    │                    │  │  • Conflict style│  │                │
                    └────────────────────┘  └──────────────────┘  └────────────────┘
                                │
                                ▼
                    ┌────────────────────────────┐
                    │  MATCH RECOMMENDATIONS     │
                    │  (Candidates ranked by     │
                    │   compatibility score)     │
                    └────────────────────────────┘
```

## Question-to-Index Mapping

### 20 Relationship Indices

| Index | Name | Critical | # Questions |
|-------|------|----------|-------------|
| AA | Attachment Anxiety | Yes | 6 |
| AV | Attachment Avoidance | Yes | 8 |
| ER | Emotional Regulation | Yes | 7 |
| CE | Conflict Engagement | Yes | 3 |
| CR | Conflict Repair Ability | Yes | 4 |
| NC | Negative Conflict Style | Yes | 7 |
| ES | Emotional Stability | Yes | 4 |
| LT | Long-Term Orientation | Yes | 3 |
| LS | Life Structure Alignment | Yes | 3 |
| RS | Responsiveness | High | 7 |
| ER2 | Emotional Responsibility | High | 4 |
| CA | Closeness–Autonomy Preference | High | 4 |
| CT | Closeness Tolerance | High | 3 |
| CD | Communication Directness | High | 5 |
| MR | Mind-Reading Expectation | High | 4 |
| JS | Jealousy / Threat Sensitivity | High | 2 |
| EN | Effort & Investment Norms | High | 6 |
| CO | Conscientiousness / Reliability | High | 5 |
| AG | Assertiveness–Agreeableness Balance | High | 4 |
| NS | Novelty vs Stability Preference | High | 2 |

### Weight Structure

**Index Importance** (used in compatibility computation):
- Critical: 1.0 weight
- High: 0.8 weight

**Contribution Weights** (question-to-index):
- Strong: 1.0 (primary source for this index)
- Medium: 0.65 (secondary signal)
- Weak: 0.35 (tertiary signal)

## Scoring Algorithm

### Step 1: Response Mapping

Each answer maps to delta values for related indices.

**Example: Question 1 - "When I sense my partner pulling away..."**

| Answer | AA Delta | AV Delta | ER Delta | CE Delta |
|--------|----------|----------|----------|----------|
| Check in and understand | -0.4 | -0.4 | +0.3 | +0.2 |
| Give space, stay available | -0.2 | +0.2 | +0.1 | -0.1 |
| React strongly | +0.5 | +0.3 | -0.3 | +0.3 |

### Step 2: Accumulate Contributions

For each index:

```
raw_index_score = Σ_questions (delta_value × weight_multiplier) / total_weight
```

Example calculation for Attachment Anxiety (AA):
- Question 1: -0.4 × 1.0 (strong) = -0.4
- Question 7: 0.5 × 0.35 (weak) = 0.175
- Total: (-0.4 + 0.175 + ...) / (1.0 + 0.35 + ...)

### Step 3: Normalize to 0-1 Range

```
final_index_score = sigmoid(raw_score × 1.5)
```

Or linear: `(raw_score + 1) / 2` clamped to [0, 1]

**Interpretation:**
- 0.5 = neutral (trait not present/absent)
- 0.7+ = trait clearly present
- 0.3- = trait clearly absent

## Bias Detection

### Four Types of Bias Detected

#### 1. Social Desirability Bias
- **Signal**: Too many high scores on "good" indices + too many low scores on "bad" indices
- **Adjustment**: Reduce consistency score by 0.15
- **Threshold**: >3 positive traits high + >2 negative traits low

#### 2. Acquiescence Bias
- **Signal**: Over 65% of responses are first/last option (pattern)
- **Adjustment**: Reduce consistency score by 0.10
- **Indicates**: Respondent not thoughtfully engaging

#### 3. Low Consistency
- **Signal**: Contradictions between related items
  - Both AA and AV high (inconsistent attachment)
  - Good conflict repair but high negative style (contradictory)
- **Adjustment**: Reduce consistency score by 0.10 per violation

#### 4. Extreme Responses
- **Signal**: >12 indices with extreme scores (< 0.2 or > 0.8)
- **Adjustment**: Reduce consistency score by 0.05
- **Indicates**: All-or-nothing thinking or careless responding

### Final Consistency Score

```
consistency = 1.0
consistency -= 0.15 if socialDesirabilityBias
consistency -= 0.10 if acquiescenceBias
consistency -= 0.10 * count if lowConsistency
consistency -= 0.05 if extremeResponses

final_consistency = clamp(consistency, 0.0, 1.0)
```

**Used in:**
- Response confidence weighting (lower consistency = less weight in matching)
- Matching algorithm (dealbreaker severity adjustment)
- User visibility score (lower consistency scores less prominently)

## Response Vector (35 dimensions)

Vectorized representation for efficient storage and matching:

```
[0-19]   Index scores (20 dimensions)
[20]     Consistency score (0-1)
[21-24]  Bias flags (4 boolean → 0 or 1)
         - Social desirability
         - Acquiescence
         - Low consistency
         - Extreme responses
[25-34]  Risk scores (10 dimensions)
         - Critical index "inversion" for risk assessment
         - AA, AV, NC = risk when high
         - ER, ES, CR, RS, CO, CD = risk when low
```

**Uses:**
- ANN indexing: Store in FAISS/HNSW for fast similarity search
- Matching: Compute compatibility via vector operations
- Caching: Precomputed and stored in vector DB

## Compatibility Scoring

### Directional Compatibility Formula

```
compatibility(A→B) = Σ_i importance_i × similarity_i / Σ_i importance_i

where:
  similarity_i = 1 - |score_A_i - score_B_i|
  importance_i = INDEX_IMPORTANCE[index_i.weight]
```

**Interpretation:**
- 1.0 = identical (for all indices)
- 0.5 = moderate difference
- 0.0 = complete mismatch

### Bidirectional (Overall) Score

```
overall_compatibility = √(compatibility(A→B) × compatibility(B→A))
```

**Why geometric mean?**
- Ensures both perspectives matter equally
- Prevents one user dominating the score
- Natural interpretation: "How well do they complement each other?"

### Per-Index Compatibility

For each of 20 indices, return a separate compatibility score:

```
index_compat_AA = 1 - |scoreA_AA - scoreB_AA|
index_compat_AV = 1 - |scoreA_AV - scoreB_AV|
... (for all 20 indices)
```

Used for:
- Detailed match explanations
- Category-level breakdowns
- Understanding specific compatibility areas

## Dealbreaker Detection

Identifies critical mismatches that predict relationship failure:

### 1. Relationship Intent Mismatch (LT)
- **Pattern**: One wants long-term, other casual
- **Threshold**: |Δ LT| > 0.6
- **Severity**: Critical
- **Impact**: Score → penalize heavily or exclude

### 2. Life Goals Misalignment (LS)
- **Pattern**: Different major life priorities (kids, location, etc.)
- **Threshold**: |Δ LS| > 0.5
- **Severity**: Critical
- **Impact**: Dealbreaker unless user explicitly tolerant

### 3. Attachment Style Incompatibility (AA, AV)
- **Patterns**:
  - Both highly anxious (both AA > 0.7)
  - Both highly avoidant (both AV > 0.7)
  - Extreme anxious-avoidant mismatch
- **Severity**: High
- **Impact**: Predicts pursue-withdraw cycles

### 4. Conflict Style Mismatch (CR, NC)
- **Pattern**: Neither repairs well + both high negative style
- **Severity**: High
- **Impact**: Conflicts escalate and never resolve

## Risk Assessment

Beyond dealbreakers, identify risk factors:

### 1. Anxiety without Regulation
- **Indicator**: AA > 0.6 AND ER < 0.4
- **Risk**: Reactive, explosive conflict
- **Severity**: Medium

### 2. Double Avoidance
- **Indicator**: Both AV > 0.65
- **Risk**: Emotional withdrawal, slow distance
- **Severity**: Medium

### 3. Low Emotional Responsiveness
- **Indicator**: RS < 0.35 (one or both)
- **Risk**: Partner feels unsupported/neglected
- **Severity**: Low-Medium

### 4. Communication Style Mismatch
- **Indicator**: One direct (CD > 0.65) + one expects intuition (MR > 0.65)
- **Risk**: Misunderstandings and frustration
- **Severity**: Low

## Category-Level Scores

Aggregate indices into 7 user-facing categories:

| Category | Indices | Example Use |
|----------|---------|-------------|
| **Attachment & Security** | AA, AV, ER, ES | How secure is the bond? |
| **Conflict & Repair** | CE, CR, NC, ER2 | Can they handle disagreements? |
| **Intimacy & Closeness** | CA, CT, AV, RS | Will they feel close? |
| **Communication** | CD, MR, RS, AG | Do they understand each other? |
| **Trust & Jealousy** | JS, AA, ES | Will there be jealousy issues? |
| **Effort & Investment** | EN, CO, RS | Will they put in effort? |
| **Values & Alignment** | LT, LS, NS | Are their life goals aligned? |

Each category:
- Weighted average of component indices
- 0-1 scale
- Per-category compatibility score computed separately

## Scalability Architecture

### For Millions of Users

#### 1. Dimensionality Reduction
- Reduce 35D vector → 20D (index scores only)
- Or use PCA/autoencoders for 10-15D embeddings
- Reduces storage and computation

#### 2. ANN Indexing
- Use FAISS or HNSW library
- Store all users' 20D vectors
- Query: O(log n) instead of O(n²)
- Update: Add new users incrementally

```python
import faiss

# Initialize index for 20-dimensional vectors
index = faiss.IndexFlatL2(20)

# Add all user vectors (millions)
index.add(np.array(user_vectors))

# Query: find top-k similar users for user X
distances, ids = index.search(user_vector_X.reshape(1, -1), k=1000)
```

#### 3. Hierarchical Matching
```
Step 1: Global filters (age, location, dealbreakers)
        → candidates down to 100k

Step 2: ANN search (vector similarity)
        → top 1,000 candidates

Step 3: Detailed scoring (full compatibility computation)
        → final 50-100 matches with explanations
```

#### 4. Storage
- **User responses**: Raw questionnaire answers (compressed)
- **Vectors**: Precomputed 20D vectors (4 bytes × 20 = 80 bytes per user)
- **Cached scores**: Optional index scores cached (80 bytes per user)
- **For 10M users**: ~1.6 GB vector storage + minimal response storage

#### 5. Real-Time Updates
- New user: Add to ANN index (~10ms)
- User updates: Recompute vector, update index (~50ms)
- Batch updates: Rebuild index nightly (efficient)

## Implementation Files

### Configuration
- **`essential2-scoring-config.js`**
  - INDICES: 20 index definitions
  - QUESTION_INDEX_MAPPINGS: 29 questions × indices
  - WEIGHT_MULTIPLIERS: strong/medium/weak → numeric
  - INDEX_IMPORTANCE: critical/high → numeric

### Scoring Engine
- **`essential2-scoring-engine.js`**
  - `Essential2Scorer` class
  - Methods:
    - `scoreResponses(responses)` → {indices, vector, consistency, biasFlags}
    - `detectBiases()` → bias detection
    - `createResponseVector()` → 35D vector for storage
    - `createCategoryScores()` → User-facing categories

### Matching
- **`compatibility-matcher.js`**
  - `CompatibilityMatcher` class
  - Methods:
    - `computeCompatibility(userA, userB)` → full analysis
    - `computeDirectionalCompatibility()` → one-way scoring
    - `identifyDealbreakers()` → critical mismatches
    - `assessRisks()` → risk factors
    - `batchComputeCompatibility()` → vectorized matching

## Usage Examples

### Basic Scoring

```javascript
const Essential2Scorer = require('./essential2-scoring-engine');
const scorer = new Essential2Scorer();

const responses = {
  1: 'Check in and try to understand',
  2: 'Offer reassurance even if it takes effort',
  3: 'Stays fairly steady',
  // ... all 29 questions
};

const result = scorer.scoreResponses(responses);

console.log('Indices:', result.indices);
console.log('Consistency:', result.consistency);
console.log('Biases:', result.biasFlags);
console.log('Vector:', result.vector); // 35D for ANN indexing
```

### Compatibility Matching

```javascript
const CompatibilityMatcher = require('./compatibility-matcher');
const matcher = new CompatibilityMatcher();

const userAScores = result.indices; // From scoring above
const userBScores = result2.indices; // Another user

const compatibility = matcher.computeCompatibility(userAScores, userBScores);

console.log('Overall:', compatibility.overallCompatibility); // 0-1
console.log('Dealbreakers:', compatibility.dealbreakers);
console.log('Risks:', compatibility.riskFactors);
```

### Efficient Matching (Millions of Users)

```javascript
// 1. Precompute vectors for all users
const allUserVectors = [];
for (const user of users) {
  const score = scorer.scoreResponses(user.responses);
  allUserVectors.push(score.vector);
}

// 2. Build ANN index
const faiss = require('faiss.js');
const index = new faiss.IndexFlatL2(20); // 20D core vector
index.add(np.array(allUserVectors.map(v => Array.from(v).slice(0, 20))));

// 3. Query for matches
const queryVector = scorer.scoreResponses(currentUser.responses).vector;
const [distances, ids] = index.search(queryVector, k=100);

// 4. Detailed scoring for top matches
const topMatches = ids.map(userId => {
  const compat = matcher.computeCompatibility(
    currentUser.scores,
    users[userId].scores
  );
  return { userId, ...compat };
});
```

## Performance Characteristics

### Scoring (Per User)
- Time: ~5-10ms (29 questions × responses)
- Memory: 35D vector (~140 bytes)
- Bias detection: ~2ms

### Matching (Per Pair)
- Time: ~0.5-1ms (20 comparisons + aggregation)
- Vectorized: ~0.1ms per pair (GPU)

### At Scale (10M Users)
- Vector storage: ~1.6 GB
- ANN index: ~5-10 GB
- Query time: <100ms for top-1000 candidates
- Detailed scoring: 10-50ms for top-100

## Future Enhancements

1. **Three-Weight System**: Add importance weights + acceptable answers
2. **Embeddings**: Use autoencoders to compress vectors further
3. **Temporal**: Track how scores change over time
4. **Behavioral**: Incorporate actual skipped questions, response timing
5. **Feedback Loop**: Adjust weights based on actual match success
6. **Machine Learning**: Train weights on successful vs failed matches
7. **Gender/Sexuality**: Conditional index importance based on demographics
8. **Relationship Stage**: Different scoring for casual vs serious seekers

## Conclusion

This scoring system provides:
- ✅ Comprehensive relationship compatibility assessment
- ✅ Bias detection and adjustment
- ✅ Scalable vector-based matching
- ✅ Millions of users with sub-second query times
- ✅ Explainable results (indices, categories, dealbreakers)
- ✅ Future-proof architecture for enhancements
