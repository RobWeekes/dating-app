/**
 * Compatibility Matcher
 *
 * Computes bidirectional compatibility between users using:
 * - Importance-weighted index matching
 * - Geometric mean for symmetry
 * - Gap-based risk assessment
 * - Dealbreaker detection
 */

import {
  ScoringResult,
  IndexScores,
  GapAndFeatureConfig,
  CompatibilityResult,
  DealbreakPattern,
  RiskFactor,
} from './types';
import { geometricMean, clamp } from './utils';

export class CompatibilityMatcher {
  private indexImportance: Record<string, number>;
  private gapConfig: GapAndFeatureConfig;
  private indexIds: string[];

  constructor(
    indexIds: string[],
    indexImportance: Record<string, number>,
    gapConfig: GapAndFeatureConfig
  ) {
    this.indexIds = indexIds;
    this.indexImportance = indexImportance;
    this.gapConfig = gapConfig;
  }

  /**
   * Compute overall compatibility between two users
   * Uses bidirectional geometric mean to ensure both users' preferences matter
   */
  computeCompatibility(
    userAScores: ScoringResult,
    userBScores: ScoringResult
  ): CompatibilityResult {
    // Compute directional compatibility (A's perspective toward B)
    const aToB = this.computeDirectionalCompatibility(
      userAScores.indices,
      userBScores.indices
    );

    // Compute directional compatibility (B's perspective toward A)
    const bToA = this.computeDirectionalCompatibility(
      userBScores.indices,
      userAScores.indices
    );

    // Overall: geometric mean ensures symmetry
    const overallCompatibility = Math.sqrt(aToB.score * bToA.score);

    // Compute per-category breakdown
    const categories = this.computeCategoryBreakdown(aToB, bToA);

    // Identify dealbreakers
    const dealbreakers = this.identifyDealbreakers(
      userAScores.indices,
      userBScores.indices
    );

    // Risk assessment including gaps
    const riskFactors = this.assessRisks(userAScores, userBScores);

    // Generate human-readable summary
    const summary = this.generateSummary(
      overallCompatibility,
      dealbreakers,
      riskFactors
    );

    return {
      overallCompatibility: clamp(overallCompatibility),
      directional: {
        aToB: aToB.score,
        bToA: bToA.score,
      },
      byCategory: categories,
      dealbreakers,
      riskFactors,
      summary,
    };
  }

  /**
   * Compute compatibility from one user's perspective
   * Uses importance-weighted index matching
   */
  private computeDirectionalCompatibility(
    fromIndices: IndexScores,
    toIndices: IndexScores
  ): { score: number; byCategory: Record<string, number> } {
    const categoryScores: Record<string, number[]> = {
      attachment: [],
      conflict: [],
      communication: [],
      values: [],
      personality: [],
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const indexId of this.indexIds) {
      const fromScore = fromIndices[indexId] ?? 0.5;
      const toScore = toIndices[indexId] ?? 0.5;

      // Calculate match quality for this index
      // Similarity is 1 - absolute difference
      const similarity = 1 - Math.abs(fromScore - toScore);

      // Apply importance weighting
      const importance = this.indexImportance[indexId] ?? 0.5;
      const weighted = similarity * importance;

      weightedSum += weighted;
      totalWeight += importance;

      // Categorize for breakdown
      this.categorizeIndex(indexId, similarity, categoryScores);
    }

    // Normalize by total weight
    const score = totalWeight > 0 ? weightedSum / totalWeight : 0.5;

    // Average within categories
    const categoryAvgs: Record<string, number> = {};
    for (const [category, scores] of Object.entries(categoryScores)) {
      categoryAvgs[category] =
        scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0.5;
    }

    return {
      score: clamp(score),
      byCategory: categoryAvgs,
    };
  }

  /**
   * Categorize indices for reporting
   */
  private categorizeIndex(
    indexId: string,
    score: number,
    categoryScores: Record<string, number[]>
  ): void {
    const attachmentIndices = ['AA', 'AV'];
    const conflictIndices = ['CE', 'CR', 'NC'];
    const communicationIndices = ['CD', 'MR'];
    const valuesIndices = ['LT', 'LS', 'NS'];
    const personalityIndices = ['ES', 'CO', 'AG', 'ER', 'ER2'];

    if (attachmentIndices.includes(indexId)) {
      categoryScores.attachment.push(score);
    }
    if (conflictIndices.includes(indexId)) {
      categoryScores.conflict.push(score);
    }
    if (communicationIndices.includes(indexId)) {
      categoryScores.communication.push(score);
    }
    if (valuesIndices.includes(indexId)) {
      categoryScores.values.push(score);
    }
    if (personalityIndices.includes(indexId)) {
      categoryScores.personality.push(score);
    }
  }

  /**
   * Compute per-category compatibility breakdown
   */
  private computeCategoryBreakdown(
    aToB: { byCategory: Record<string, number> },
    bToA: { byCategory: Record<string, number> }
  ) {
    const breakdown: Record<string, any> = {};

    for (const category of Object.keys(aToB.byCategory)) {
      const aToBScore = aToB.byCategory[category];
      const bToAScore = bToA.byCategory[category];
      const overall = Math.sqrt(aToBScore * bToAScore);

      breakdown[category] = {
        aToB: clamp(aToBScore),
        bToA: clamp(bToAScore),
        overall: clamp(overall),
      };
    }

    return breakdown;
  }

  /**
   * Identify dealbreaker patterns
   * Critical indices where mismatch causes fundamental incompatibility
   */
  private identifyDealbreakers(
    scoresA: IndexScores,
    scoresB: IndexScores
  ): { found: boolean; patterns: DealbreakPattern[]; count: number } {
    const patterns: DealbreakPattern[] = [];

    // Define dealbreaker patterns
    const dealbreakPatterns = [
      {
        name: 'Long-term orientation mismatch',
        indices: ['LT'],
        description: 'One wants commitment, the other casual dating',
        penalty: 0.3,
        check: (a: number, b: number) => Math.abs(a - b) > 0.5,
      },
      {
        name: 'Life structure misalignment',
        indices: ['LS'],
        description: 'Fundamental disagreement on major life decisions',
        penalty: 0.25,
        check: (a: number, b: number) => Math.abs(a - b) > 0.5,
      },
      {
        name: 'Attachment style incompatibility',
        indices: ['AA', 'AV'],
        description: 'One anxious, one avoidant = pursuit-withdrawal cycle',
        penalty: 0.25,
        check: (a: number, b: number) => {
          const aa = scoresA['AA'] ?? 0.5;
          const av = scoresA['AV'] ?? 0.5;
          const ba = scoresB['AA'] ?? 0.5;
          const bv = scoresB['AV'] ?? 0.5;
          return (aa > 0.6 && bv > 0.6) || (av > 0.6 && ba > 0.6);
        },
      },
      {
        name: 'Closeness-autonomy conflict',
        indices: ['CA', 'CT'],
        description: 'One needs togetherness, other needs independence',
        penalty: 0.2,
        check: (a: number, b: number) => Math.abs(a - b) > 0.5,
      },
      {
        name: 'Conflict avoidance mismatch',
        indices: ['CE'],
        description: 'One engages, other avoids = issues never resolve',
        penalty: 0.2,
        check: (a: number, b: number) => {
          const aEngage = scoresA['CE'] ?? 0.5;
          const bEngage = scoresB['CE'] ?? 0.5;
          return (aEngage > 0.6 && bEngage < 0.3) || (aEngage < 0.3 && bEngage > 0.6);
        },
      },
    ];

    // Check each pattern
    for (const pattern of dealbreakPatterns) {
      let isMatch = false;

      if (pattern.indices.length === 1) {
        const idx = pattern.indices[0];
        const scoreA = scoresA[idx] ?? 0.5;
        const scoreB = scoresB[idx] ?? 0.5;
        isMatch = pattern.check(scoreA, scoreB);
      } else {
        // Multi-index pattern
        isMatch = pattern.check(0, 0);
      }

      if (isMatch) {
        patterns.push({
          name: pattern.name,
          indices: pattern.indices,
          description: pattern.description,
          penalty: pattern.penalty,
        });
      }
    }

    return {
      found: patterns.length > 0,
      patterns,
      count: patterns.length,
    };
  }

  /**
   * Assess relationship risks from gaps and patterns
   */
  private assessRisks(
    userA: ScoringResult,
    userB: ScoringResult
  ): RiskFactor[] {
    const risks: RiskFactor[] = [];

    // Check mutual high-risk gaps
    const highRiskGaps = Object.entries(userA.gapRisks)
      .filter(([_, isRisk]) => isRisk)
      .filter(([gapId, _]) => userB.gapRisks[gapId])
      .map(([gapId, _]) => gapId);

    if (highRiskGaps.length >= 2) {
      risks.push({
        name: 'Mutual behavioral volatility',
        severity: highRiskGaps.length >= 3 ? 'critical' : 'high',
        description: `Both partners show stress-related behavior changes in ${highRiskGaps.length} gap areas`,
      });
    }

    // Check consistency issues
    if (
      userA.consistency < 0.6 ||
      userB.consistency < 0.6 ||
      userA.consistency + userB.consistency < 1.2
    ) {
      risks.push({
        name: 'Low response reliability',
        severity: userA.consistency < 0.5 || userB.consistency < 0.5 ? 'high' : 'moderate',
        description:
          'One or both partners show bias or inconsistency in responses',
      });
    }

    // Check emotional stability gap
    const aaA = userA.indices['AA'] ?? 0.5;
    const avA = userA.indices['AV'] ?? 0.5;
    const aaB = userB.indices['AA'] ?? 0.5;
    const avB = userB.indices['AV'] ?? 0.5;

    if ((aaA > 0.65 && avB > 0.65) || (avA > 0.65 && aaB > 0.65)) {
      risks.push({
        name: 'Anxious-avoidant pairing',
        severity: 'high',
        description: 'Classic pursue-withdraw cycle likely',
      });
    }

    return risks;
  }

  /**
   * Generate human-readable compatibility summary
   */
  private generateSummary(
    score: number,
    dealbreakers: { count: number },
    risks: RiskFactor[]
  ): string {
    if (dealbreakers.count > 0) {
      return `${dealbreakers.count} critical dealbreaker(s) detected - strong incompatibility`;
    }

    if (score > 0.85) {
      return 'Exceptionally compatible - strong potential for relationship success';
    }

    if (score > 0.7) {
      return 'Well-matched with solid compatibility foundation';
    }

    if (score > 0.55) {
      const criticalRisks = risks.filter(r => r.severity === 'critical').length;
      if (criticalRisks > 0) {
        return `Moderately compatible but with ${criticalRisks} critical risk factor(s)`;
      }
      return 'Moderately compatible - require effort and communication';
    }

    if (score > 0.4) {
      return 'Below average compatibility - significant challenges likely';
    }

    return 'Poor compatibility match - fundamental differences expected';
  }
}
