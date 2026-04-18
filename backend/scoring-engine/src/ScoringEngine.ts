/**
 * Essential2 Scoring Engine
 *
 * Core scoring logic:
 * - Maps 31 question responses to 22 compatibility indices
 * - Implements vectorization for ANN indexing
 * - Includes bias detection and consistency validation
 * - Integrates gap calculation for behavioral under-pressure assessment
 */

import {
  ScoringResult,
  UserResponses,
  IndexScores,
  BiasDetection,
  IndexConfig,
  WeightConfig,
  ItemDeltaConfig,
  GapAndFeatureConfig,
  ScoringMetadata,
} from './types';
import {
  normalizeScore,
  createIndexVector,
  mean,
  clamp,
  ConfigLoader,
} from './utils';
import { GapCalculator } from './GapCalculator';

export class ScoringEngine {
  private indexConfig: IndexConfig;
  private weightConfig: WeightConfig;
  private itemDeltaConfig: ItemDeltaConfig;
  private gapConfig: GapAndFeatureConfig;
  private gapCalculator: GapCalculator;
  private indexIds: string[];

  constructor(configPath: string) {
    const configs = ConfigLoader.loadAllConfigs(configPath);

    this.indexConfig = configs.indices;
    this.weightConfig = configs.weights;
    this.itemDeltaConfig = configs.questions;
    this.gapConfig = configs.gaps;
    this.gapCalculator = new GapCalculator(configs.gaps);

    // Cache index order for vector creation
    this.indexIds = Object.keys(this.indexConfig.indices);
  }

  /**
   * Score user's questionnaire responses
   *
   * INPUT: { questionId -> answerText }
   * OUTPUT: Full scoring result with indices, vector, gaps, consistency
   */
  scoreResponses(responses: UserResponses): ScoringResult {
    // Validate inputs
    if (!responses || typeof responses !== 'object') {
      throw new Error(
        'Responses must be an object: { questionId -> answerText }'
      );
    }

    // Initialize index contributions
    const indexContributions: Record<
      string,
      { sum: number; weight: number }
    > = {};
    this.indexIds.forEach(id => {
      indexContributions[id] = { sum: 0, weight: 0 };
    });

    // Track patterns for bias detection
    const responsePatterns: number[] = [];
    const questionsAnswered: number[] = [];

    // Process each response
    for (const [questionIdStr, answerText] of Object.entries(responses)) {
      const questionId = parseInt(questionIdStr, 10);

      // Check if question exists in config
      const questionStr = String(questionId);
      const questionConfig = this.itemDeltaConfig.questionIndexMappings[
        questionStr
      ];
      if (!questionConfig) {
        console.warn(`Unknown question ID: ${questionId}`);
        continue;
      }

      // Check if answer exists in response mapping
      const responseMapping = questionConfig.responseMapping[answerText];
      if (!responseMapping) {
        console.warn(
          `Unknown answer for question ${questionId}: "${answerText}"`
        );
        continue;
      }

      questionsAnswered.push(questionId);

      // Extract response index (A=0, B=1, C=2) for pattern tracking
      const answerKeys = Object.keys(questionConfig.responseMapping);
      const answerIndex = answerKeys.indexOf(answerText);
      responsePatterns.push(answerIndex);

      // Apply contributions to indices
      for (const [indexId, delta] of Object.entries(responseMapping)) {
        const indexDef = questionConfig.indices[indexId];
        if (!indexDef) continue;

        // Get weight multiplier (strong=1.0, medium=0.65, weak=0.3)
        const multiplier = this.weightConfig.weightMultipliers[indexDef.weight];

        // Add weighted contribution
        const weightedDelta = delta * multiplier;
        indexContributions[indexId].sum += weightedDelta;
        indexContributions[indexId].weight += multiplier;
      }
    }

    // Normalize index contributions to 0-1 scores
    const indexScores: IndexScores = {};
    for (const indexId of this.indexIds) {
      const contribution = indexContributions[indexId];

      // Avoid division by zero
      if (contribution.weight === 0) {
        indexScores[indexId] = 0.5; // Default neutral score
      } else {
        // Average the contributions, then normalize
        const rawScore = contribution.sum / contribution.weight;
        indexScores[indexId] = normalizeScore(rawScore, {
          method: 'sigmoid',
          scaleFactor: 1.5,
        });
      }
    }

    // Detect biases in response pattern
    const biasDetection = this.detectBiases(
      indexScores,
      responsePatterns,
      responses
    );

    // Calculate behavioral gaps (trait vs state)
    const gapResults = this.gapCalculator.calculateAllGaps(
      responses,
      indexScores
    );

    // Create response vector for ANN indexing
    const vector = createIndexVector(indexScores, this.indexIds);

    // Create metadata summary
    const metadata: ScoringMetadata = {
      respondedQuestions: questionsAnswered.length,
      totalQuestions: Object.keys(this.itemDeltaConfig.questionIndexMappings)
        .length,
      patterns: this.summarizePatterns(responsePatterns),
      gapSummary: this.gapCalculator.generateGapSummary(gapResults),
      timestamp: new Date().toISOString(),
    };

    return {
      indices: indexScores,
      vector,
      consistency: biasDetection.consistency,
      biasFlags: biasDetection.flags,
      gaps: gapResults.gaps,
      gapRisks: gapResults.riskFlags,
      overallGapRisk: gapResults.overallGapRisk,
      metadata,
    };
  }

  /**
   * Detect response biases including:
   * - Social desirability (too many ideal answers)
   * - Acquiescence (always choosing first/last option)
   * - Consistency (contradictions across related items)
   * - Response extremity (all extreme scores)
   */
  private detectBiases(
    indexScores: IndexScores,
    responsePatterns: number[],
    responses: UserResponses
  ): BiasDetection {
    const flags = {
      socialDesirabilityBias: false,
      acquiescenceBias: false,
      lowConsistency: false,
      responseExtremity: false,
    };
    let consistencyScore = 1.0;

    // ========== BIAS 1: Social Desirability ==========
    const positiveIndices = ['CR', 'RS', 'ER2', 'CO', 'ES'];
    const positiveScores = positiveIndices
      .map(id => indexScores[id] ?? 0.5)
      .filter(s => s > 0.7).length;

    const negativeIndices = ['AA', 'AV', 'NC', 'JS'];
    const negativeScores = negativeIndices
      .map(id => indexScores[id] ?? 0.5)
      .filter(s => s < 0.3).length;

    if (positiveScores > 3 && negativeScores > 2) {
      flags.socialDesirabilityBias = true;
      consistencyScore -= 0.15;
    }

    // ========== BIAS 2: Acquiescence / Extremity ==========
    if (responsePatterns.length > 5) {
      const firstAnswerCount = responsePatterns.filter(
        (_, idx) => idx % 3 === 0
      ).length;
      if (firstAnswerCount / responsePatterns.length > 0.65) {
        flags.acquiescenceBias = true;
        consistencyScore -= 0.1;
      }
    }

    // ========== BIAS 3: Consistency Check ==========
    const consistencyPairs = [
      {
        indices: ['AA', 'AV'],
        name: 'Attachment consistency',
        check: (s1: number, s2: number) => s1 > 0.6 && s2 > 0.6,
      },
      {
        indices: ['ER', 'ES'],
        name: 'Emotional stability consistency',
        check: () => false, // Generally compatible
      },
      {
        indices: ['CR', 'NC'],
        name: 'Conflict handling consistency',
        check: (s1: number, s2: number) => s1 < 0.4 && s2 > 0.6,
      },
      {
        indices: ['CD', 'MR'],
        name: 'Communication consistency',
        check: () => false, // Complex relationship
      },
    ];

    let consistencyViolations = 0;
    for (const pair of consistencyPairs) {
      const [idx1, idx2] = pair.indices;
      const score1 = indexScores[idx1] ?? 0.5;
      const score2 = indexScores[idx2] ?? 0.5;

      if (pair.check(score1, score2)) {
        consistencyViolations += 1;
      }
    }

    if (consistencyViolations > 1) {
      flags.lowConsistency = true;
      consistencyScore -= 0.1 * consistencyViolations;
    }

    // ========== BIAS 4: Response Extremity ==========
    const allScores = Object.values(indexScores);
    const extremeCount = allScores.filter(s => s < 0.2 || s > 0.8).length;

    if (extremeCount > 12) {
      flags.responseExtremity = true;
      consistencyScore -= 0.1;
    }

    return {
      consistency: clamp(consistencyScore, 0, 1),
      flags,
    };
  }

  /**
   * Summarize response patterns for reporting
   */
  private summarizePatterns(responsePatterns: number[]): string[] {
    const patterns: string[] = [];

    if (responsePatterns.length === 0) {
      return patterns;
    }

    // Check for response tendencies
    const answerCounts = [0, 0, 0]; // A, B, C
    for (const idx of responsePatterns) {
      if (idx >= 0 && idx < 3) {
        answerCounts[idx]++;
      }
    }

    const total = responsePatterns.length;
    const aPercent = Math.round((answerCounts[0] / total) * 100);
    const bPercent = Math.round((answerCounts[1] / total) * 100);
    const cPercent = Math.round((answerCounts[2] / total) * 100);

    if (aPercent > 50) patterns.push(`Tendency toward first options (${aPercent}%)`);
    if (cPercent > 50) patterns.push(`Tendency toward last options (${cPercent}%)`);
    if (bPercent > 60) patterns.push(`Strong preference for middle responses (${bPercent}%)`);

    return patterns;
  }

  /**
   * Get index importance weights
   * Used in compatibility weighting
   */
  getIndexImportance(indexId: string): number {
    const indexDef = this.indexConfig.indices[indexId];
    if (!indexDef) return 0.5;

    return this.indexConfig.indexImportance[indexDef.weight] ?? 0.5;
  }

  /**
   * Get all index definitions
   */
  getIndices() {
    return this.indexConfig.indices;
  }

  /**
   * Get all gap definitions
   */
  getGaps() {
    return this.gapConfig.gapDefinitions;
  }
}
