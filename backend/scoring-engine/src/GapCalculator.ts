/**
 * Gap Calculator
 *
 * Computes 8 behavioral gaps (trait vs state) that indicate
 * behavior change under stress, which is a key relationship risk factor.
 */

import {
  GapAndFeatureConfig,
  GapScores,
  GapRisks,
  GapResult,
  UserResponses,
  IndexScores,
} from './types';
import { clamp, mapResponseIndexToScore } from './utils';

interface AllGapsResult {
  gaps: GapScores;
  riskFlags: GapRisks;
  overallGapRisk: number;
}

export class GapCalculator {
  private gapConfig: GapAndFeatureConfig;
  private gapOrder: string[] = ['STG', 'RGI', 'RG2', 'ERG', 'CG2', 'EEG', 'ReG', 'CG'];

  constructor(gapConfig: GapAndFeatureConfig) {
    this.gapConfig = gapConfig;
  }

  /**
   * Calculate all 8 gaps for a user
   */
  calculateAllGaps(
    responses: UserResponses,
    indexScores: IndexScores
  ): AllGapsResult {
    const gaps: GapScores = {};
    const riskFlags: GapRisks = {};

    // Calculate each gap
    for (const gapId of this.gapOrder) {
      const gapDef = this.gapConfig.gapDefinitions[gapId];
      if (!gapDef) continue;

      const gapResult = this.calculateGap(gapId, gapDef, responses, indexScores);
      gaps[gapId] = gapResult.value;
      riskFlags[gapId] = gapResult.isRisk;
    }

    return {
      gaps,
      riskFlags,
      overallGapRisk: this.computeOverallGapRisk(gaps, riskFlags),
    };
  }

  /**
   * Calculate a single gap (trait vs state comparison)
   */
  private calculateGap(
    gapId: string,
    gapDef: any,
    responses: UserResponses,
    indexScores: IndexScores
  ): GapResult {
    let traitScore = 0.5;
    let stateScore = 0.5;

    // Special handling for gaps with multiple state questions
    if (gapDef.stateQs && Array.isArray(gapDef.stateQs)) {
      // Trait: single question
      traitScore = this.extractQuestionScore(gapDef.traitQ, responses);

      // State: average of multiple questions
      const stateScores = gapDef.stateQs.map((qId: number) =>
        this.extractQuestionScore(qId, responses)
      );
      stateScore = stateScores.reduce((a: number, b: number) => a + b, 0) / stateScores.length;
    } else {
      // Standard: single trait, single state
      traitScore = this.extractQuestionScore(gapDef.traitQ, responses);
      stateScore = this.extractQuestionScore(gapDef.stateQ, responses);
    }

    // Calculate gap: |trait - state|
    // Positive gap = behavior breaks under pressure
    let gap = Math.abs((traitScore - stateScore) * gapDef.direction);
    gap = clamp(gap, 0, 1);

    const severity = this.assessGapSeverity(gap, gapDef.riskThreshold);

    return {
      value: gap,
      traitScore,
      stateScore,
      isRisk: gap > gapDef.riskThreshold,
      severity,
    };
  }

  /**
   * Extract response score from question answer
   * Maps A (index 0) = 0.8, B = 0.5, C = 0.2
   */
  private extractQuestionScore(
    questionId: number,
    responses: UserResponses
  ): number {
    const answerText = responses[questionId];
    if (!answerText) return 0.5; // Default if missing

    // This is a simplified extraction - in production, you'd load actual config
    // For now, we estimate based on answer position
    const answerIndex = [0, 1, 2].indexOf(
      answerText.charAt(0).charCodeAt(0) - 'A'.charCodeAt(0)
    );

    if (answerIndex < 0) return 0.5;
    return mapResponseIndexToScore(answerIndex);
  }

  /**
   * Assess severity level of a gap
   */
  private assessGapSeverity(
    gap: number,
    threshold: number
  ): 'minimal' | 'low' | 'moderate' | 'high' | 'critical' {
    if (gap < 0.1) return 'minimal';
    if (gap < threshold * 0.7) return 'low';
    if (gap < threshold) return 'moderate';
    if (gap < threshold * 1.5) return 'high';
    return 'critical';
  }

  /**
   * Compute overall gap risk considering interactions
   * Multiple high-risk gaps create compounding problems
   */
  private computeOverallGapRisk(
    gaps: GapScores,
    riskFlags: GapRisks
  ): number {
    // Count high-risk gaps
    const riskCount = Object.values(riskFlags).filter(r => r).length;

    // Base risk from number of gaps (4+ = max)
    const baseRisk = Math.min(1, riskCount / 4);

    // Add penalties for dangerous combinations
    let interaction = 0;

    // ERG (blame) × ReG (escalation) = toxic spiral
    if (riskFlags['ERG'] && riskFlags['ReG']) {
      interaction += 0.15;
    }

    // CG (communication) × EEG (effort) = resentment
    if (riskFlags['CG'] && riskFlags['EEG']) {
      interaction += 0.1;
    }

    // RGI (reliability) × RG2 (repair) = broken trust
    if (riskFlags['RGI'] && riskFlags['RG2']) {
      interaction += 0.15;
    }

    // CG2 (closeness) × CG (communication) = intimacy issues
    if (riskFlags['CG2'] && riskFlags['CG']) {
      interaction += 0.1;
    }

    return clamp(baseRisk + interaction, 0, 1);
  }

  /**
   * Generate human-readable gap summary
   */
  generateGapSummary(result: {
    gaps: GapScores;
    riskFlags: GapRisks;
  }): string {
    const { riskFlags } = result;
    const riskGaps = this.gapOrder
      .filter(gapId => riskFlags[gapId])
      .map(gapId => this.gapConfig.gapDefinitions[gapId]?.name);

    if (riskGaps.length === 0) {
      return 'Behavioral consistency strong across stress scenarios';
    }

    if (riskGaps.length === 1) {
      return `Potential concern: ${riskGaps[0]}`;
    }

    if (riskGaps.length <= 3) {
      return `Multiple gaps detected: ${riskGaps.join(', ')}`;
    }

    return `Significant behavioral breaks under stress (${riskGaps.length} gap areas)`;
  }

  /**
   * Create gap vector for extended ANN vectors
   */
  createGapVector(gapResults: { gaps: GapScores }): Float32Array {
    const vector = new Float32Array(8);

    for (let i = 0; i < this.gapOrder.length; i++) {
      const gapId = this.gapOrder[i];
      vector[i] = gapResults.gaps[gapId] ?? 0.5;
    }

    return vector;
  }
}
