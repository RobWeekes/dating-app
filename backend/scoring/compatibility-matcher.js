/**
 * Essential Questionnaire 2 - Compatibility Matching
 *
 * Vectorized compatibility scoring for millions of users
 * Implements three-weight system and hierarchical matching
 * Optimized for efficient ANN-based retrieval
 */

const { INDICES, INDEX_IMPORTANCE } = require('./essential2-scoring-config');

/**
 * Compatibility Matching Engine
 *
 * Computes compatibility scores between user pairs
 * Supports bidirectional matching and importance weighting
 */
class CompatibilityMatcher {
  constructor() {
    this.indexIds = Object.keys(INDICES);
  }

  /**
   * Compute overall compatibility between two users
   *
   * Uses bidirectional geometric mean to ensure both users' preferences matter
   * Formula: √(A→B compatibility × B→A compatibility)
   *
   * @param {Object} userAScores - User A's index scores { indexId → score }
   * @param {Object} userBScores - User B's index scores { indexId → score }
   * @returns {Object} Detailed compatibility analysis
   */
  computeCompatibility(userAScores, userBScores) {
    if (!userAScores || !userBScores) {
      throw new Error('Both user scores required');
    }

    // Compute directional compatibility (A's perspective)
    const aToB = this.computeDirectionalCompatibility(userAScores, userBScores);

    // Compute directional compatibility (B's perspective)
    const bToA = this.computeDirectionalCompatibility(userBScores, userAScores);

    // Overall: geometric mean ensures symmetry
    const overallPct = Math.sqrt(aToB.score * bToA.score);

    // Per-category breakdown
    const categories = {};
    for (const [catIdx] of Object.entries(aToB.byCategory)) {
      const aCat = aToB.byCategory[catIdx];
      const bCat = bToA.byCategory[catIdx];
      categories[catIdx] = {
        aToB: aCat,
        bToA: bCat,
        overall: Math.sqrt(aCat * bCat)
      };
    }

    // Identify dealbreakers
    const dealbreakers = this.identifyDealbreakers(userAScores, userBScores);

    // Risk assessment
    const riskFactors = this.assessRisks(userAScores, userBScores);

    return {
      overallCompatibility: overallPct,
      directional: {
        aToB: aToB.score,
        bToA: bToA.score
      },
      byCategory: categories,
      dealbreakers,
      riskFactors,
      summary: this.generateSummary(overallPct, dealbreakers, riskFactors)
    };
  }

  /**
   * Compute compatibility from one user's perspective
   * Measures how well the other user fits their preferences and tolerances
   *
   * In a real system with importance weights, this would compute:
   *   Score = Σ_i importance_i * match_score_i / Σ_i importance_i
   *
   * For now, using direct index similarity with importance weighting
   *
   * @param {Object} perspectiveUser - The person whose perspective we're taking
   * @param {Object} otherUser - The other person we're evaluating
   * @returns {Object} Compatibility from perspective user's viewpoint
   */
  computeDirectionalCompatibility(perspectiveUser, otherUser) {
    const weightedScores = {};
    const byCategory = {};

    // Calculate weighted similarity for each index
    for (const indexId of this.indexIds) {
      const perspScore = perspectiveUser[indexId] ?? 0.5;
      const otherScore = otherUser[indexId] ?? 0.5;

      // Similarity metric: 1 - |difference|
      // Higher similarity = closer scores
      const rawSimilarity = 1 - Math.abs(perspScore - otherScore);

      // Get importance weight for this index
      const importance = INDEX_IMPORTANCE[INDICES[indexId].weight] || 0.8;

      // Weighted contribution
      weightedScores[indexId] = rawSimilarity * importance;
      byCategory[indexId] = rawSimilarity;
    }

    // Compute overall score: weighted average
    const totalWeight = this.indexIds.reduce((sum, id) => {
      return sum + (INDEX_IMPORTANCE[INDICES[id].weight] || 0.8);
    }, 0);

    const score = Object.values(weightedScores).reduce((sum, s) => sum + s, 0) / totalWeight;

    return {
      score: Math.max(0, Math.min(1, score)), // Clamp to [0, 1]
      byCategory,
      weighted: weightedScores
    };
  }

  /**
   * Identify dealbreaker mismatches
   *
   * Dealbreakers are critical indices where both high and low values
   * can create incompatibility depending on context.
   *
   * Examples:
   *   - LT: Long-Term Orientation (one wants marriage, one doesn't)
   *   - LS: Life Structure Alignment (different life goals)
   *   - AA/AV: High mismatch on attachment styles
   *
   * @param {Object} userAScores - User A's scores
   * @param {Object} userBScores - User B's scores
   * @returns {Array} List of dealbreaker concerns
   */
  identifyDealbreakers(userAScores, userBScores) {
    const dealbreakers = [];

    // Define dealbreaker patterns
    const patterns = [
      {
        name: 'Relationship Intent Mismatch',
        indices: ['LT'],
        check: (aScore, bScore) => Math.abs(aScore - bScore) > 0.6,
        severity: 'critical'
      },
      {
        name: 'Life Goals Misalignment',
        indices: ['LS'],
        check: (aScore, bScore) => Math.abs(aScore - bScore) > 0.5,
        severity: 'critical'
      },
      {
        name: 'Attachment Style Incompatibility',
        indices: ['AA', 'AV'],
        check: (aScore, bScore) => {
          // Both highly anxious OR both highly avoidant can be problematic
          if (aScore > 0.7 && bScore > 0.7) return true;
          // Or extreme mismatch: one anxious, one avoidant
          if (Math.abs(aScore - bScore) > 0.6 && (aScore > 0.6 || bScore > 0.6)) return true;
          return false;
        },
        severity: 'high'
      },
      {
        name: 'Conflict Style Mismatch',
        indices: ['CR', 'NC'],
        check: (aScore, bScore) => {
          // One good at repair, one not
          const crA = userAScores.CR ?? 0.5;
          const crB = userBScores.CR ?? 0.5;
          const ncA = userAScores.NC ?? 0.5;
          const ncB = userBScores.NC ?? 0.5;
          return (crA < 0.3 && crB < 0.3) || (ncA > 0.7 && ncB > 0.7);
        },
        severity: 'high'
      }
    ];

    for (const pattern of patterns) {
      for (const indexId of pattern.indices) {
        const aScore = userAScores[indexId] ?? 0.5;
        const bScore = userBScores[indexId] ?? 0.5;

        if (pattern.check(aScore, bScore)) {
          dealbreakers.push({
            name: pattern.name,
            index: indexId,
            userAScore: aScore,
            userBScore: bScore,
            severity: pattern.severity
          });
        }
      }
    }

    return dealbreakers;
  }

  /**
   * Assess relationship risk factors
   * Identifies patterns that predict relationship difficulty
   *
   * @param {Object} userAScores - User A's scores
   * @param {Object} userBScores - User B's scores
   * @returns {Object} Risk factors and their severity
   */
  assessRisks(userAScores, userBScores) {
    const risks = [];

    // Risk 1: High Attachment Anxiety + Low Emotional Regulation
    const aAA = userAScores.AA ?? 0.5;
    const aER = userAScores.ER ?? 0.5;
    const bAA = userBScores.AA ?? 0.5;
    const bER = userBScores.ER ?? 0.5;

    if ((aAA > 0.6 && aER < 0.4) || (bAA > 0.6 && bER < 0.4)) {
      risks.push({
        name: 'Anxiety without Regulation',
        severity: 'medium',
        affectedUser: aAA > 0.6 && aER < 0.4 ? 'A' : 'B',
        description: 'High attachment anxiety combined with low emotional regulation can lead to reactive conflict'
      });
    }

    // Risk 2: Both High Avoidance
    const aAV = userAScores.AV ?? 0.5;
    const bAV = userBScores.AV ?? 0.5;

    if (aAV > 0.65 && bAV > 0.65) {
      risks.push({
        name: 'Double Avoidance',
        severity: 'medium',
        description: 'Both partners withdraw under stress; difficulty with repair and reconnection'
      });
    }

    // Risk 3: Low Responsiveness
    const aRS = userAScores.RS ?? 0.5;
    const bRS = userBScores.RS ?? 0.5;

    if (aRS < 0.35 || bRS < 0.35) {
      risks.push({
        name: 'Low Emotional Responsiveness',
        severity: 'low-medium',
        affectedUser: aRS < 0.35 ? 'A' : 'B',
        description: 'Difficulty meeting partner\'s emotional needs'
      });
    }

    // Risk 4: Communication Mismatch (directness vs mind-reading)
    const aCD = userAScores.CD ?? 0.5;
    const aMR = userAScores.MR ?? 0.5;
    const bCD = userBScores.CD ?? 0.5;
    const bMR = userBScores.MR ?? 0.5;

    if ((aCD > 0.65 && bMR > 0.65) || (bCD > 0.65 && aMR > 0.65)) {
      risks.push({
        name: 'Communication Style Mismatch',
        severity: 'low',
        description: 'One partner expects directness; other expects intuition'
      });
    }

    // Risk 5: Poor Conflict Repair
    const aCR = userAScores.CR ?? 0.5;
    const bCR = userBScores.CR ?? 0.5;

    if (aCR < 0.3 && bCR < 0.3) {
      risks.push({
        name: 'Weak Conflict Repair',
        severity: 'high',
        description: 'Neither partner can effectively repair after conflict'
      });
    }

    return {
      riskCount: risks.length,
      hasHighRisk: risks.some(r => r.severity === 'high'),
      risks
    };
  }

  /**
   * Generate a human-readable compatibility summary
   * @param {number} overallScore - Overall compatibility percentage
   * @param {Array} dealbreakers - Dealbreaker list
   * @param {Object} riskFactors - Risk assessment
   * @returns {string} Summary text
   */
  generateSummary(overallScore, dealbreakers, riskFactors) {
    let summary = '';

    // Overall assessment
    if (overallScore > 0.75) {
      summary = 'Excellent compatibility ';
    } else if (overallScore > 0.6) {
      summary = 'Very good compatibility ';
    } else if (overallScore > 0.45) {
      summary = 'Moderate compatibility ';
    } else if (overallScore > 0.3) {
      summary = 'Low compatibility ';
    } else {
      summary = 'Poor compatibility ';
    }

    // Dealbreaker flag
    const criticalDealbreakers = dealbreakers.filter(d => d.severity === 'critical');
    if (criticalDealbreakers.length > 0) {
      summary += '(with dealbreaker concerns)';
    }

    // Risk summary
    if (riskFactors.hasHighRisk) {
      summary += ' - High relationship risk identified';
    }

    return summary;
  }

  /**
   * Create a vectorized compatibility score for ANN matching
   * Represents two users' compatibility in a standardized format
   *
   * @param {Object} userAScores - User A's index scores
   * @param {Object} userBScores - User B's index scores
   * @returns {Float32Array} Vectorized compatibility representation
   */
  createCompatibilityVector(userAScores, userBScores) {
    const compat = this.computeCompatibility(userAScores, userBScores);

    // Vector structure:
    // [0]: Overall compatibility
    // [1-20]: Per-index compatibility deltas (how different are they)
    // [21]: Dealbreaker count (0-5)
    // [22]: Risk count (0-5)
    // Total: 23 dimensions

    const vector = new Float32Array(23);
    let idx = 0;

    // Overall compatibility
    vector[idx++] = compat.overallCompatibility;

    // Per-index difference (similarity)
    for (const indexId of this.indexIds) {
      const diff = Math.abs((userAScores[indexId] ?? 0.5) - (userBScores[indexId] ?? 0.5));
      vector[idx++] = diff; // 0 = very similar, 1 = very different
    }

    // Dealbreaker count (normalized 0-1)
    vector[idx++] = Math.min(1, compat.dealbreakers.length / 5);

    // Risk count (normalized 0-1)
    vector[idx++] = Math.min(1, compat.riskFactors.riskCount / 5);

    return vector;
  }

  /**
   * Batch compute compatibility for multiple pairs
   * Vectorized for efficient GPU computation
   *
   * @param {Array} userPairs - Array of { userA, userB } objects
   * @returns {Array} Array of compatibility results
   */
  batchComputeCompatibility(userPairs) {
    return userPairs.map(pair => {
      try {
        return {
          userA: pair.userA.id,
          userB: pair.userB.id,
          ...this.computeCompatibility(pair.userA.scores, pair.userB.scores)
        };
      } catch (err) {
        console.error(`Error computing compatibility for pair: ${err.message}`);
        return null;
      }
    }).filter(result => result !== null);
  }
}

module.exports = CompatibilityMatcher;
