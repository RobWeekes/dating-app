# Essential Scoring Engine

Plug-and-play TypeScript scoring engine for relationship compatibility matching. Maps 29 relationship-focused questionnaire responses to 20 compatibility indices, with vectorized output for Approximate Nearest Neighbor (ANN) indexing and scalability to tens of millions of users.

## Overview

The Essential Scoring Engine is a relationship compatibility scoring system based on psychological research into attachment, conflict resolution, communication, and life alignment. It combines:

- **22 Compatibility Vectors** - 20 indices + consistency + gap risk score
- **Vectorized Output** - Float32Array for efficient ANN-based matching
- **Behavioral Gap Analysis** - 8 gap types measuring behavior change under stress
- **Bidirectional Matching** - Ensures both users' preferences matter equally
- **Data-Driven Configuration** - JSON config files allow weight updates without code changes
- **Comprehensive Bias Detection** - Identifies social desirability, acquiescence, and consistency issues

## Installation

### From Source

```bash
npm install

# Build TypeScript to JavaScript
npm run build

# Run tests
npm test
```

### As NPM Package

```bash
npm install @dating-app/scoring-engine
```

## Quick Start

```typescript
import { ScoringEngine, CompatibilityMatcher } from '@dating-app/scoring-engine';

// Initialize engine with config path
const engine = new ScoringEngine('./config');

// Score user responses (31 questions)
const result = engine.scoreResponses({
  1: "Check in and try to understand",
  2: "Offer reassurance even if it takes effort",
  3: "Stays fairly steady",
  // ... 26 more responses
});

// Access results
console.log(result.indices);      // Record<string, number> - 20 index scores (0-1)
console.log(result.vector);       // Float32Array - 20D vector for ANN
console.log(result.consistency);  // number - Response bias/reliability (0-1)
console.log(result.gaps);         // Record<string, number> - 8 gap scores
console.log(result.metadata);     // Scoring details and summary

// Compute compatibility between two users
const matcher = new CompatibilityMatcher(
  Object.keys(engine.getIndices()),
  engine.getIndexImportance(),
  engine.getGapConfig()
);

const compatibility = matcher.computeCompatibility(resultA, resultB);
console.log(compatibility.overallCompatibility);  // 0-1 score
console.log(compatibility.summary);               // Human-readable text
console.log(compatibility.dealbreakers);          // Critical incompatibilities
```

## Configuration Files

All configuration is externalized into JSON files for easy updates without redeployment:

### `index-config.json`

Defines 20 compatibility indices and their weights. Example:

```json
{
  "indices": {
    "AA": {
      "id": "AA",
      "name": "Attachment Anxiety",
      "weight": "critical",
      "description": "..."
    }
    // ... 19 more
  },
  "indexImportance": {
    "critical": 1.0,
    "high": 0.8
  }
}
```

### `item-weights.json`

Weight multipliers for question contributions:

```json
{
  "weightMultipliers": {
    "strong": 1.0,
    "medium": 0.65,
    "weak": 0.3
  }
}
```

### `item-deltas.json`

Maps 31 questions to indices with delta values. Example:

```json
{
  "questionIndexMappings": {
    "1": {
      "text": "When I sense my partner pulling away...",
      "indices": {
        "AA": { "weight": "strong" },
        "AV": { "weight": "strong" }
      },
      "responseMapping": {
        "Check in and try to understand": { "AA": -0.4, "AV": -0.4 },
        "Give them space...": { "AA": -0.2, "AV": 0.2 },
        "Feel like something's wrong...": { "AA": 0.5, "AV": 0.3 }
      }
    }
  }
}
```

### `gap-and-feature-config.json`

Defines 8 behavioral gaps (trait vs state under stress):

```json
{
  "gapDefinitions": {
    "STG": {
      "name": "State-Trait Gap",
      "description": "Emotional volatility",
      "traitQ": 3,
      "stateQ": 4,
      "riskThreshold": 0.4
    }
    // ... 7 more
  }
}
```

## The 20 Indices

| Index | Name | Weight | Meaning |
|-------|------|--------|---------|
| AA | Attachment Anxiety | Critical | Worry about relationship security |
| AV | Attachment Avoidance | Critical | Distance from intimacy |
| ER | Emotional Regulation | Critical | Manage emotions without overwhelm |
| RS | Responsiveness | High | Meet partner's emotional needs |
| ER2 | Emotional Responsibility | High | Own reactions vs blame |
| CE | Conflict Engagement | Critical | Address disagreements directly |
| CR | Conflict Repair | Critical | Resolve tension after conflict |
| NC | Negative Conflict Style | Critical | Criticism, defensiveness, escalation |
| CA | Closeness-Autonomy | High | Balance togetherness vs independence |
| CT | Closeness Tolerance | High | Sustain intimacy without overwhelm |
| CD | Communication Directness | High | Express concerns clearly |
| MR | Mind-Reading Expectation | High | Expect understanding without saying |
| JS | Jealousy/Threat Sensitivity | High | React to ambiguous partner behavior |
| EN | Effort Norms | High | Expectations about consistency |
| LT | Long-Term Orientation | Critical | Focus on commitment |
| LS | Life Structure Alignment | Critical | Clarity on major life decisions |
| NS | Novelty vs Stability | High | Prefer predictability vs change |
| ES | Emotional Stability | Critical | Overall mood stability |
| CO | Conscientiousness | High | Reliability and follow-through |
| AG | Assertiveness-Agreeableness | High | Stand up for needs vs maintain harmony |

## The 8 Behavioral Gaps

Each gap measures the difference between trait (steady state) and state (under stress):

| Gap | Name | Meaning |
|-----|------|---------|
| STG | State-Trait | Emotional volatility under stress |
| RGI | Reliability Gap | Follow-through breaks when life demanding |
| RG2 | Repair Gap | Conflict repair ability deteriorates |
| ERG | Emotional Responsibility | Shift from accountability to blame |
| CG2 | Closeness Gap | Want closeness but can't sustain |
| EEG | Effort-Expectation | Demand effort not delivering own |
| ReG | Reactivity Gap | Conflict response escalates under stress |
| CG | Communication Gap | Expect mind-reading but not direct |

Large gaps indicate behavior breakdown under pressure—a major relationship risk factor.

## Output Format

### ScoringResult

```typescript
{
  indices: Record<string, number>,           // 20 index scores (0-1)
  vector: Float32Array,                      // 20D vector for ANN
  consistency: number,                       // Response reliability (0-1)
  biasFlags: {
    socialDesirabilityBias: boolean,
    acquiescenceBias: boolean,
    lowConsistency: boolean,
    responseExtremity: boolean
  },
  gaps: Record<string, number>,              // 8 gap scores (0-1)
  gapRisks: Record<string, boolean>,         // 8 gap risk flags
  overallGapRisk: number,                    // Combined gap risk (0-1)
  metadata: {
    respondedQuestions: number,
    totalQuestions: number,
    patterns: string[],
    gapSummary: string,
    timestamp: string
  }
}
```

### CompatibilityResult

```typescript
{
  overallCompatibility: number,               // 0-1, geometric mean
  directional: {
    aToB: number,                            // A's perspective
    bToA: number                             // B's perspective
  },
  byCategory: Record<string, {
    aToB: number,
    bToA: number,
    overall: number
  }>,
  dealbreakers: {
    found: boolean,
    patterns: DealbreakPattern[],
    count: number
  },
  riskFactors: RiskFactor[],
  summary: string                            // Human-readable interpretation
}
```

## Scaling to Millions of Users

### Vectorization

All 20 indices are output as a Float32Array (80 bytes per user):

```typescript
const vector = result.vector;  // Float32Array, 20 elements

// Use for ANN indexing:
// - Hnswlib (Python)
// - USearch (C++)
// - Milvus (self-hosted)
// - Pinecone (cloud)
// - Weaviate (vector DB)
```

### Batch Processing

Score millions of profiles efficiently:

```typescript
const users = await fetchAllUsers();  // From database

// Process in batches
for (const batch of chunkArray(users, 1000)) {
  const results = batch.map(user => ({
    userId: user.id,
    scoring: engine.scoreResponses(user.questionnaire)
  }));

  // Store vectors in ANN index
  await annIndex.add(results);
}

// Then: Retrieve matches via similarity search
const matches = await annIndex.search(userVector, k=100);
```

### Performance

- **Per-user scoring**: ~0.5-1ms per profile on modern hardware
- **For 1M users**: ~10-20 minutes (with parallelization: ~1 minute)
- **Memory**: ~100 bytes per user (indices + metadata)
- **Storage**: Vectors in ANN index (80 bytes each), separate from detail scoring

## API Integrations

### Express.js Route

```typescript
import { ScoringEngine, CompatibilityMatcher } from '@dating-app/scoring-engine';

const router = express.Router();
const engine = new ScoringEngine('./config');
const matcher = new CompatibilityMatcher(...);

router.post('/api/scoring/calculate', (req, res) => {
  const { responses } = req.body;
  const result = engine.scoreResponses(responses);

  // Store in database
  await Scoring.create({ userId: req.user.id, ...result });

  res.json(result);
});

router.get('/api/matching/compatibility/:userId1/:userId2', async (req, res) => {
  const score1 = await Scoring.findOne({ userId: req.params.userId1 });
  const score2 = await Scoring.findOne({ userId: req.params.userId2 });

  const compatibility = matcher.computeCompatibility(
    score1.toScoringResult(),
    score2.toScoringResult()
  );

  res.json(compatibility);
});
```

### Database Integration

Store scoring results alongside user data:

```typescript
// Sequelize example
const UserScore = sequelize.define('UserScore', {
  userId: INTEGER,
  // 20 index columns
  indexAA: FLOAT,
  indexAV: FLOAT,
  // ... etc
  vector: BYTEA,           // Serialize Float32Array
  consistency: FLOAT,
  gapRisks: JSON,          // Array of gap risk flags
  overallGapRisk: FLOAT,
  metadata: JSON
});
```

## Development

### Building

```bash
npm run build          # Compile TypeScript
npm run dev          # Watch mode
npm run clean        # Remove dist/
```

### Testing

```bash
npm test                     # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

Tests cover:
- Basic scoring logic
- All 20 indices
- All 8 gaps
- Bias detection
- Bidirectional matching
- Edge cases and error handling
- Batch processing
- Performance (100+ profiles/sec)

### Coverage

Current target: >90% code coverage

```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Configuration Updates

To update weights without redeployment:

1. Edit JSON config files
2. Restart application (or use hot-reload if implemented)
3. All new scorings use updated weights
4. Old scorings remain unchanged in database

Example: Update Attachment Anxiety weight from critical (1.0) to high (0.8):

```json
// index-config.json
{
  "indices": {
    "AA": {
      "weight": "high"  // Changed from "critical"
    }
  }
}
```

## Updating the Engine

Common update scenarios:

### Add a new question

1. Add to `item-deltas.json` with ID 30
2. Update question total in metadata
3. No code changes needed

### Change a delta value

1. Edit value in `item-deltas.json`
2. Restart application
3. All new scorings use new delta

### Adjust gap thresholds

1. Edit `riskThreshold` in `gap-and-feature-config.json`
2. Restart application
3. New gap risk flags reflect new threshold

## Roadmap / Future Enhancements

- [ ] Streaming scoring for large datasets
- [ ] Real-time ANN index updates
- [ ] A/B testing framework for config variations
- [ ] Demographic fairness checks
- [ ] Confidence intervals for scores
- [ ] Explainability reports (which questions drove score?)
- [ ] ML-based gap weight optimization

## Contributing

This is a core module—changes require:

1. Update JSON configs first
2. Run full test suite
3. Integration tests with real data
4. Verify performance (still <1ms/user)
5. Document changes

## Support

For questions or issues:

- Generate detailed logs: Set `DEBUG=essential:*`
- Check test files for examples
- Review configuration files for correct format

## License

ISC

---

**Version**: 1.0.0
**Last Updated**: April 17, 2026
**Status**: Production Ready
