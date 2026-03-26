/**
 * Essential Questionnaire 2 - Gap Calculator
 *
 * Computes behavioral gaps (trait vs state) across 8 dimensions:
 * - STG:  State-Trait Gap (emotional volatility)
 * - RGI:  Reliability Gap Index (follow-through under stress)
 * - RG2:  Repair Gap (actual repair vs commitment)
 * - ERG:  Emotional Responsibility Gap (accountability under stress)
 * - CG2:  Closeness Gap (desire vs capacity)
 * - EEG:  Effort-Expectation Gap (expectations vs delivery)
 * - ReG:  Reactivity Gap (escalation under stress)
 * - CG:   Communication Gap (clarity expectations vs directness)
 *
 * Gap Penalties: Large gaps indicate behavior breakdown under pressure
 * Used in Risk Penalty layer of compatibility matching
 */

const { QUESTION_INDEX_MAPPINGS } = require('./essential2-scoring-config');

/**
 * Map question responses to normalized scores (0-1)
 * Used by gap calculator to extract trait/state values
 *
 * For multi-option questions, we map responses A/B/C to scores
 * Scoring direction depends on the index being measured
 */
function mapResponseToScore(responseIndex, direction = 1) {
  // responseIndex: 0=A, 1=B, 2=C (e.g., index 0 = first option)
  // direction: 1 = normal, -1 = inverted
  // Maps to: A=high, B=medium, C=low
  const scores = [0.8, 0.5, 0.2]; // A=80%, B=50%, C=20%
  return scores[responseIndex] * direction + (1 - direction) * (1 - scores[responseIndex]);
}

/**
 * Extract response index from answer text
 * Assumes responses are pre-mapped to answer texts from config
 */
function getResponseIndex(answerText, questionId) {
  const question = QUESTION_INDEX_MAPPINGS[questionId];
  if (!question) return null;

  const answers = Object.keys(question.responseMapping);
  const idx = answers.indexOf(answerText);
  return idx >= 0 ? idx : null;
}

class GapCalculator {
  constructor() {
    // Define which questions measure trait (calm state) vs state (stress)
    this.gapDefinitions = {
      STG: {
        name: 'State-Trait Gap',
        description: 'Emotional volatility: stability under stress',
        traitQ: 3,  // Q3: baseline emotional stability
        stateQ: 4,  // Q4: reaction when very upset
        direction: 1, // Higher gap = more volatile
        riskThreshold: 0.4
      },
      RGI: {
        name: 'Reliability Gap Index',
        description: 'Follow-through: consistency when life demanding',
        traitQ: 18, // Q18: effort trait (full/busy)
        stateQ: 19, // Q19: effort under stress
        direction: 1,
        riskThreshold: 0.4
      },
      RG2: {
        name: 'Repair Gap',
        description: 'Conflict repair: actual vs baseline',
        traitQ: 10, // Q10: repair after conflict
        stateQ: 11, // Q11: repair when still tense
        direction: 1,
        riskThreshold: 0.35
      },
      ERG: {
        name: 'Emotional Responsibility Gap',
        description: 'Attribution: ownership vs blame under stress',
        traitQ: 5,  // Q5: attribution belief (trait)
        stateQ: 7,  // Q7: attribution when really upset (state)
        direction: 1,
        riskThreshold: 0.4
      },
      CG2: {
        name: 'Closeness Gap',
        description: 'Intimacy: desire vs ability to sustain',
        traitQ: 12, // Q12: closeness preference
        stateQ: 21, // Q21: tolerance after prolonged closeness
        direction: 1,
        riskThreshold: 0.35
      },
      EEG: {
        name: 'Effort-Expectation Gap',
        description: 'Fairness: expectations vs delivery',
        traitQ: 22, // Q22: effort expectations (what they demand)
        stateQ: 19, // Q19: effort under stress (what they deliver)
        direction: 1,
        riskThreshold: 0.4
      },
      ReG: {
        name: 'Reactivity Gap',
        description: 'Escalation: how much worse under stress',
        // Averaging Q1 (withdrawal reaction) and Q4 (upset reaction)
        // vs Q8 (baseline small disagreement handling)
        traitQ: 8,  // Q8: baseline conflict handling
        stateQs: [1, 4], // Q1: reaction to withdrawal, Q4: reaction when upset
        direction: 1,
        riskThreshold: 0.35
      },
      CG: {
        name: 'Communication Gap',
        description: 'Expression: clarity expectations vs directness',
        traitQ: 15, // Q15: mind-reading expectations (inverse)
        stateQs: [14, 20], // Q14, Q20: directness behavior
        direction: 1,
        riskThreshold: 0.35
      }
    };
  }

  /**
   * Calculate all gaps for a user
   * @param {Object} responses - { questionId → answerText }
   * @param {Object} indexScores - Pre-calculated 20 index scores
   * @returns {Object} All gap scores and risk flags
   */
  calculateAllGaps(responses, indexScores) {
    const gaps = {};
    const riskFlags = {};

    // Calculate each gap type
    for (const [gapId, def] of Object.entries(this.gapDefinitions)) {
      const gapScore = this.calculateGap(gapId, def, responses, indexScores);
      gaps[gapId] = gapScore.value;
      riskFlags[gapId] = gapScore.isRisk;
    }

    return {
      gaps,
      riskFlags,
      overallGapRisk: this.computeOverallGapRisk(gaps, riskFlags)
    };
  }

  /**
   * Calculate a single gap
   * @param {string} gapId - Gap identifier (e.g., 'STG')
   * @param {Object} def - Gap definition from gapDefinitions
   * @param {Object} responses - User responses
   * @param {Object} indexScores - Index scores
   * @returns {Object} { value: 0-1, isRisk: boolean }
   */
  calculateGap(gapId, def, responses, indexScores) {
    let traitScore = 0.5;
    let stateScore = 0.5;

    // Special handling for gaps with multiple state questions
    if (def.stateQs && Array.isArray(def.stateQs)) {
      // Get trait score (single question)
      traitScore = this.extractQuestionScore(def.traitQ, responses, indexScores);

      // Get averaged state score (multiple questions)
      const stateScores = def.stateQs.map(qId =>
        this.extractQuestionScore(qId, responses, indexScores)
      );
      stateScore = stateScores.reduce((a, b) => a + b) / stateScores.length;
    } else {
      // Standard: single trait, single state
      traitScore = this.extractQuestionScore(def.traitQ, responses, indexScores);
      stateScore = this.extractQuestionScore(def.stateQ, responses, indexScores);
    }

    // Calculate gap: max(0, trait - state)
    // Positive gap means trait > state (behavior breaks under pressure)
    let gap = Math.max(0, (traitScore - stateScore) * def.direction);

    // Normalize to 0-1 range (clamped)
    gap = Math.max(0, Math.min(1, gap));

    return {
      value: gap,
      traitScore,
      stateScore,
      isRisk: gap > def.riskThreshold,
      severity: this.assessGapSeverity(gap, def.riskThreshold)
    };
  }

  /**
   * Extract a question's score from responses
   * Maps answer text to 0-1 scale
   * @param {number} questionId - Question number (1-29)
   * @param {Object} responses - { questionId → answerText }
   * @param {Object} indexScores - Index scores for context
   * @returns {number} Score 0-1
   */
  extractQuestionScore(questionId, responses, indexScores) {
    const answerText = responses[questionId];
    if (!answerText) return 0.5; // Default if missing

    const question = QUESTION_INDEX_MAPPINGS[questionId];
    if (!question) return 0.5;

    const answerIndex = Object.keys(question.responseMapping).indexOf(answerText);
    if (answerIndex < 0) return 0.5;

    // For most questions: A (index 0) = high (0.8), B = medium (0.5), C = low (0.2)
    // This captures the progression of answers
    const baseScore = [0.8, 0.5, 0.2][answerIndex] ?? 0.5;

    return baseScore;
  }

  /**
   * Assess severity level of a gap
   * @param {number} gap - Gap value 0-1
   * @param {number} threshold - Risk threshold for this gap
   * @returns {string} Severity level
   */
  assessGapSeverity(gap, threshold) {
    if (gap < 0.1) return 'minimal';
    if (gap < threshold * 0.7) return 'low';
    if (gap < threshold) return 'moderate';
    if (gap < threshold * 1.5) return 'high';
    return 'critical';
  }

  /**
   * Compute overall gap risk score
   * Accounts for interactions between gaps
   * @param {Object} gaps - All gap scores
   * @param {Object} riskFlags - Risk status for each gap
   * @returns {number} Overall risk 0-1
   */
  computeOverallGapRisk(gaps, riskFlags) {
    // Count high-risk gaps
    const riskCount = Object.values(riskFlags).filter(r => r).length;

    // Base risk from number of high-risk gaps
    const baseRisk = Math.min(1, riskCount / 4); // 4+ gaps = max risk

    // Add interaction penalties for dangerous combinations
    let interaction = 0;

    // ERG × ReG: Blame + Escalation = highly toxic
    if (riskFlags.ERG && riskFlags.ReG) {
      interaction += 0.15;
    }

    // CG × EEG: Unclear expectations + effort mismatch = resentment
    if (riskFlags.CG && riskFlags.EEG) {
      interaction += 0.1;
    }

    // RGI × RG2: Disappearing + unable to repair = trust collapse
    if (riskFlags.RGI && riskFlags.RG2) {
      interaction += 0.15;
    }

    // CG2 × CG: Closeness desire/tolerance mismatch + communication issues
    if (riskFlags.CG2 && riskFlags.CG) {
      interaction += 0.1;
    }

    return Math.min(1, baseRisk + interaction);
  }

  /**
   * Create gap vector component for ANN storage
   * Stores compressed gap information in vector
   * @param {Object} gapResults - Results from calculateAllGaps
   * @returns {Float32Array} 8-dimensional gap vector
   */
  createGapVector(gapResults) {
    const vector = new Float32Array(8);
    const gapOrder = ['STG', 'RGI', 'RG2', 'ERG', 'CG2', 'EEG', 'ReG', 'CG'];

    for (let i = 0; i < gapOrder.length; i++) {
      vector[i] = gapResults.gaps[gapOrder[i]] ?? 0.5;
    }

    return vector;
  }

  /**
   * Generate human-readable gap summary
   * @param {Object} gapResults - Results from calculateAllGaps
   * @returns {string} Text summary of key gaps
   */
  generateGapSummary(gapResults) {
    const { gaps, riskFlags } = gapResults;
    const risks = Object.entries(riskFlags)
      .filter(([_, isRisk]) => isRisk)
      .map(([gapId, _]) => this.gapDefinitions[gapId].name);

    if (risks.length === 0) {
      return 'Behavioral consistency strong across stress scenarios';
    }

    if (risks.length === 1) {
      return `Potential concern: ${risks[0]}`;
    }

    if (risks.length <= 3) {
      return `Multiple gaps detected: ${risks.join(', ')}`;
    }

    return `Significant behavioral breaks under stress (${risks.length} gap areas)`;
  }
}

module.exports = GapCalculator;
