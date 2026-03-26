/**
 * Essential Questionnaire 2 - Scoring Algorithm
 *
 * Vectorized scoring system for millions of users
 * Maps 29 question responses → 20 relationship compatibility indices
 * Includes bias detection and consistency validation
 */

const {
  INDICES,
  QUESTION_INDEX_MAPPINGS,
  WEIGHT_MULTIPLIERS,
  INDEX_IMPORTANCE
} = require('./essential2-scoring-config');

/**
 * Sigmoid function for normalizing scores to 0-1 range
 * @param {number} x - Input value
 * @returns {number} Between 0 and 1
 */
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

/**
 * Calculate a single index score from raw contributions
 * Higher than 0.5 = trait present, lower than 0.5 = trait absent
 * @param {number} rawScore - Sum of weighted contributions
 * @param {string} normalization - 'sigmoid' or 'linear'
 * @returns {number} Score between 0 and 1
 */
function normalizeScore(rawScore, normalization = 'sigmoid') {
  if (normalization === 'sigmoid') {
    return sigmoid(rawScore * 1.5); // Scale factor for sensitivity
  }
  // Linear normalization: clip raw score to [-1, 1] then scale to [0, 1]
  return Math.max(0, Math.min(1, (rawScore + 1) / 2));
}

/**
 * Main Scoring Engine
 *
 * INPUT:
 *   responses: { questionId → answerText, ... }
 *
 * OUTPUT:
 *   {
 *     indices: { indexId → score (0-1) },
 *     vector: Float32Array for ANN indexing,
 *     consistency: number (0-1),
 *     biasFlags: { biasName → boolean },
 *     metadata: { details about response patterns }
 *   }
 */
class Essential2Scorer {
  constructor() {
    this.indexIds = Object.keys(INDICES);
  }

  /**
   * Score a single user's questionnaire responses
   * @param {Object} responses - { questionId (numeric) → answerText }
   * @returns {Object} Scoring result with indices, vector, and bias flags
   */
  scoreResponses(responses) {
    // Validate inputs
    if (!responses || typeof responses !== 'object') {
      throw new Error('Responses must be an object: { questionId → answerText }');
    }

    // Initialize index contributions (will be summed across questions)
    const indexContributions = {};
    this.indexIds.forEach(id => {
      indexContributions[id] = { sum: 0, weight: 0 };
    });

    // Track consistency for bias detection
    const consistencyChecks = {};
    const responsePatterns = [];

    // Process each question
    for (const [questionIdStr, answerText] of Object.entries(responses)) {
      const questionId = parseInt(questionIdStr);
      if (!QUESTION_INDEX_MAPPINGS[questionId]) {
        console.warn(`Unknown question ID: ${questionId}`);
        continue;
      }

      const question = QUESTION_INDEX_MAPPINGS[questionId];
      const responseMapping = question.responseMapping[answerText];

      if (!responseMapping) {
        console.warn(`Unknown answer for question ${questionId}: "${answerText}"`);
        continue;
      }

      // Record pattern for bias detection
      responsePatterns.push({
        questionId,
        section: question.section,
        answer: answerText,
        critical: question.critical,
        deltas: responseMapping
      });

      // Accumulate contributions to each index
      for (const [indexId, delta] of Object.entries(responseMapping)) {
        if (!(indexId in indexContributions)) continue;

        const questionConfig = question.indices[indexId];
        if (!questionConfig) continue;

        const weightMultiplier = WEIGHT_MULTIPLIERS[questionConfig.weight];
        indexContributions[indexId].sum += delta * weightMultiplier;
        indexContributions[indexId].weight += weightMultiplier;
      }
    }

    // Calculate final index scores
    const indexScores = {};
    for (const indexId of this.indexIds) {
      const contrib = indexContributions[indexId];
      if (contrib.weight === 0) {
        // No data for this index - use neutral score
        indexScores[indexId] = 0.5;
      } else {
        const rawScore = contrib.sum / contrib.weight;
        indexScores[indexId] = normalizeScore(rawScore);
      }
    }

    // Detect biases and consistency issues
    const biasDetection = this.detectBiases(indexScores, responsePatterns, responses);

    // Create response vector for ANN indexing and compatibility matching
    const vector = this.createResponseVector(indexScores, biasDetection);

    return {
      indices: indexScores,
      vector,
      consistency: biasDetection.consistency,
      biasFlags: biasDetection.flags,
      metadata: {
        respondedQuestions: Object.keys(responses).length,
        totalQuestions: Object.keys(QUESTION_INDEX_MAPPINGS).length,
        patterns: this.summarizePatterns(responsePatterns),
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Detect response biases including:
   *   - Social desirability bias (too many "ideal" answers)
   *   - Acquiescence bias (always choosing first/last option)
   *   - Consistency (contradictions across related items)
   *   - Response extremity (all extreme scores)
   *
   * @param {Object} indexScores - Calculated index scores
   * @param {Array} responsePatterns - List of response patterns
   * @param {Object} responses - Raw responses
   * @returns {Object} Bias detection results
   */
  detectBiases(indexScores, responsePatterns, responses) {
    const flags = {};
    let consistencyScore = 1.0; // Starts at perfect

    // ========== BIAS 1: Social Desirability Bias ==========
    // Look for responses that are too positive/ideal
    const positiveIndices = ['CR', 'RS', 'ER2', 'CO', 'ES'];
    const positiveScores = positiveIndices
      .map(id => indexScores[id] ?? 0.5)
      .filter(s => s > 0.7);

    const negativeIndices = ['AA', 'AV', 'NC', 'JS'];
    const negativeScores = negativeIndices
      .map(id => indexScores[id] ?? 0.5)
      .filter(s => s < 0.3);

    if (positiveScores.length > 3 && negativeScores.length > 2) {
      flags.socialDesirabilityBias = true;
      consistencyScore -= 0.15;
    } else {
      flags.socialDesirabilityBias = false;
    }

    // ========== BIAS 2: Acquiescence / Extremity Bias ==========
    // Look for patterns (always first answer, always extreme, etc.)
    const firstAnswerCount = responsePatterns.filter((p, idx) => idx % 3 === 0).length;
    const responseCount = responsePatterns.length;

    if (responseCount > 5 && firstAnswerCount / responseCount > 0.65) {
      flags.acquiescenceBias = true;
      consistencyScore -= 0.10;
    } else {
      flags.acquiescenceBias = false;
    }

    // ========== BIAS 3: Consistency Check ==========
    // Compare related items for contradictions
    const consistencyPairs = [
      { indices: ['AA', 'AV'], name: 'Attachment consistency' },
      { indices: ['ER', 'ES'], name: 'Emotional stability consistency' },
      { indices: ['CR', 'NC'], name: 'Conflict handling consistency' },
      { indices: ['CD', 'MR'], name: 'Communication consistency' }
    ];

    let consistencyViolations = 0;
    for (const pair of consistencyPairs) {
      const [idx1, idx2] = pair.indices;
      const score1 = indexScores[idx1] ?? 0.5;
      const score2 = indexScores[idx2] ?? 0.5;

      // Attachment Anxiety and Avoidance should not both be high
      if (pair.name === 'Attachment consistency') {
        if (score1 > 0.6 && score2 > 0.6) {
          consistencyViolations += 1;
        }
      }
      // Conflict repair and negative style should not both be high
      else if (pair.name === 'Conflict handling consistency') {
        if (score1 < 0.4 && score2 > 0.6) {
          consistencyViolations += 1;
        }
      }
    }

    if (consistencyViolations > 1) {
      flags.lowConsistency = true;
      consistencyScore -= 0.10 * consistencyViolations;
    } else {
      flags.lowConsistency = false;
    }

    // ========== BIAS 4: Response Extremity ==========
    // Check if scores are too polarized
    const scores = Object.values(indexScores);
    const extreme = scores.filter(s => s < 0.2 || s > 0.8).length;

    if (extreme > 12) {
      flags.extremeResponses = true;
      consistencyScore -= 0.05;
    } else {
      flags.extremeResponses = false;
    }

    // ========== Final Consistency Score ==========
    const finalConsistency = Math.max(0, Math.min(1, consistencyScore));

    return {
      consistency: finalConsistency,
      flags,
      biasAdjustment: 1 - (1 - finalConsistency) * 0.2 // Mild adjustment factor
    };
  }

  /**
   * Create a vectorized response for efficient matching and storage
   * Used for ANN indexing and similarity computations
   *
   * @param {Object} indexScores - All 20 index scores
   * @param {Object} biasDetection - Bias information
   * @returns {Float32Array} Vectorized user representation
   */
  createResponseVector(indexScores, biasDetection) {
    // Vector structure:
    // Slots 0-19: Index scores (20 indices)
    // Slot 20: Consistency score
    // Slots 21-24: Bias flags (boolean as 0/1)
    // Slots 25-34: "Risk" scores derived from critical indices
    // Total: 35 dimensions

    const vector = new Float32Array(35);

    // Populate index scores
    let idx = 0;
    for (const indexId of this.indexIds) {
      vector[idx++] = indexScores[indexId];
    }

    // Consistency score
    vector[idx++] = biasDetection.consistency;

    // Bias flags (convert boolean to 0/1)
    vector[idx++] = biasDetection.flags.socialDesirabilityBias ? 1 : 0;
    vector[idx++] = biasDetection.flags.acquiescenceBias ? 1 : 0;
    vector[idx++] = biasDetection.flags.lowConsistency ? 1 : 0;
    vector[idx++] = biasDetection.flags.extremeResponses ? 1 : 0;

    // Derived "risk" scores for critical indices (used in matching)
    // These highlight key compatibility concerns
    const criticalIndices = ['AA', 'AV', 'ER', 'CE', 'CR', 'NC', 'LT', 'LS', 'ES'];
    for (const indexId of criticalIndices) {
      const score = indexScores[indexId];
      // For high-risk indices (AA, AV, NC), invert so higher = more risk
      if (['AA', 'AV', 'NC'].includes(indexId)) {
        vector[idx++] = score; // Keep as-is: high score = high risk
      } else {
        vector[idx++] = 1 - score; // Invert: low score = risk
      }
    }

    return vector;
  }

  /**
   * Create category-level scores (aggregate multiple indices)
   * Useful for presenting results to users
   *
   * @param {Object} indexScores - All 20 index scores
   * @returns {Object} Category scores
   */
  createCategoryScores(indexScores) {
    const categories = {
      attachment: {
        name: 'Attachment & Security',
        indices: ['AA', 'AV', 'ER', 'ES'],
        weight: 1.0
      },
      conflict: {
        name: 'Conflict & Repair',
        indices: ['CE', 'CR', 'NC', 'ER2'],
        weight: 1.0
      },
      intimacy: {
        name: 'Intimacy & Closeness',
        indices: ['CA', 'CT', 'AV', 'RS'],
        weight: 0.9
      },
      communication: {
        name: 'Communication & Understanding',
        indices: ['CD', 'MR', 'RS', 'AG'],
        weight: 0.85
      },
      trust: {
        name: 'Trust & Jealousy',
        indices: ['JS', 'AA', 'ES'],
        weight: 0.8
      },
      investment: {
        name: 'Effort & Investment',
        indices: ['EN', 'CO', 'RS'],
        weight: 0.85
      },
      values: {
        name: 'Values & Life Alignment',
        indices: ['LT', 'LS', 'NS'],
        weight: 0.95
      }
    };

    const categoryScores = {};
    for (const [catKey, catConfig] of Object.entries(categories)) {
      const scores = catConfig.indices
        .map(idx => indexScores[idx] ?? 0.5)
        .filter(s => s !== undefined);

      const avg = scores.length > 0
        ? scores.reduce((sum, s) => sum + s, 0) / scores.length
        : 0.5;

      categoryScores[catKey] = {
        name: catConfig.name,
        score: avg,
        weight: catConfig.weight,
        weighted: avg * catConfig.weight
      };
    }

    return categoryScores;
  }

  /**
   * Summarize response patterns for metadata and bias reporting
   * @param {Array} responsePatterns - Response pattern data
   * @returns {Object} Summary statistics
   */
  summarizePatterns(responsePatterns) {
    if (responsePatterns.length === 0) {
      return { summary: 'No responses' };
    }

    // Section distribution
    const bySections = {};
    responsePatterns.forEach(p => {
      if (!bySections[p.section]) {
        bySections[p.section] = 0;
      }
      bySections[p.section]++;
    });

    // Critical question count
    const criticalCount = responsePatterns.filter(p => p.critical).length;

    // Average magnitude of responses
    const magnitudes = responsePatterns
      .flatMap(p => Object.values(p.deltas))
      .filter(d => typeof d === 'number');

    const avgMagnitude = magnitudes.length > 0
      ? magnitudes.reduce((sum, m) => sum + Math.abs(m), 0) / magnitudes.length
      : 0;

    return {
      sectionDistribution: bySections,
      criticalQuestionsAnswered: criticalCount,
      averageResponseMagnitude: avgMagnitude
    };
  }
}

module.exports = Essential2Scorer;
