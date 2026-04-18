/**
 * Utility Functions for Scoring Engine
 *
 * Includes normalization, vector creation, and math helpers
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  IndexConfig,
  WeightConfig,
  ItemDeltaConfig,
  GapAndFeatureConfig,
  NormalizationOptions,
  VectorOptions,
  ScoringResult,
} from './types';

/**
 * Sigmoid function for normalizing scores to 0-1 range
 * Maps unbounded values to smooth S-curve between 0 and 1
 */
export function sigmoid(x: number, scaleFactor: number = 1.5): number {
  return 1 / (1 + Math.exp(-x * scaleFactor));
}

/**
 * Normalize a score using specified method
 * Higher than 0.5 = trait present, lower than 0.5 = trait absent
 */
export function normalizeScore(
  rawScore: number,
  options: NormalizationOptions = { method: 'sigmoid', scaleFactor: 1.5 }
): number {
  if (options.method === 'sigmoid') {
    return sigmoid(rawScore, options.scaleFactor);
  }

  // Linear normalization: clip raw score to [-1, 1] then scale to [0, 1]
  return Math.max(0, Math.min(1, (rawScore + 1) / 2));
}

/**
 * Load configuration files from disk
 * All configs are loaded at startup for efficiency
 */
export class ConfigLoader {
  static loadIndexConfig(configPath: string): IndexConfig {
    const filePath = path.join(configPath, 'index-config.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  static loadWeightConfig(configPath: string): WeightConfig {
    const filePath = path.join(configPath, 'item-weights.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  static loadItemDeltaConfig(configPath: string): ItemDeltaConfig {
    const filePath = path.join(configPath, 'item-deltas.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  static loadGapAndFeatureConfig(configPath: string): GapAndFeatureConfig {
    const filePath = path.join(configPath, 'gap-and-feature-config.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Load all configurations in one call
   */
  static loadAllConfigs(configPath: string) {
    return {
      indices: this.loadIndexConfig(configPath),
      weights: this.loadWeightConfig(configPath),
      questions: this.loadItemDeltaConfig(configPath),
      gaps: this.loadGapAndFeatureConfig(configPath),
    };
  }
}

/**
 * Create a 20-dimensional vector from index scores
 * Used for ANN (Approximate Nearest Neighbor) indexing and fast matching
 */
export function createIndexVector(
  indexScores: Record<string, number>,
  indexOrder: string[]
): Float32Array {
  const vector = new Float32Array(indexOrder.length);

  for (let i = 0; i < indexOrder.length; i++) {
    const indexId = indexOrder[i];
    vector[i] = indexScores[indexId] ?? 0.5;
  }

  return vector;
}

/**
 * Create extended vector combining indices, gaps, and consistency
 * For comprehensive similarity matching
 */
export function createExtendedVector(
  result: ScoringResult,
  gapOrder: string[]
): Float32Array {
  // 20 indices + 8 gaps + 1 consistency + 1 overall gap risk = 30 dimensions
  const vector = new Float32Array(30);

  // First 20: index scores
  let idx = 0;
  for (const [indexId, score] of Object.entries(result.indices)) {
    vector[idx++] = score;
  }

  // Next 8: gap scores
  for (const gapId of gapOrder) {
    vector[idx++] = result.gaps[gapId] ?? 0.5;
  }

  // Then: metadata
  vector[28] = result.consistency;
  vector[29] = result.overallGapRisk;

  return vector;
}

/**
 * Extract response index from answer text
 * Assumes responses are in order (A=0, B=1, C=2)
 */
export function getResponseIndex(
  answerText: string,
  possibleAnswers: string[]
): number {
  const idx = possibleAnswers.indexOf(answerText);
  return idx >= 0 ? idx : -1;
}

/**
 * Map response index to score (0-1)
 * A (0) = 0.8, B (1) = 0.5, C (2) = 0.2
 */
export function mapResponseIndexToScore(responseIndex: number): number {
  const scores = [0.8, 0.5, 0.2];
  return scores[responseIndex] ?? 0.5;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number = 0, max: number = 1): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Calculate mean of array
 */
export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[]): number {
  const avg = mean(values);
  const squareDiffs = values.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squareDiffs));
}

/**
 * Geometric mean (for bidirectional compatibility)
 */
export function geometricMean(a: number, b: number): number {
  return Math.sqrt(a * b);
}

/**
 * Calculate Euclidean distance between two vectors (for ANN)
 */
export function euclideanDistance(
  vector1: Float32Array,
  vector2: Float32Array
): number {
  let sum = 0;
  const len = Math.min(vector1.length, vector2.length);

  for (let i = 0; i < len; i++) {
    const diff = vector1[i] - vector2[i];
    sum += diff * diff;
  }

  return Math.sqrt(sum);
}

/**
 * Calculate cosine similarity between two vectors (for ANN)
 */
export function cosineSimilarity(
  vector1: Float32Array,
  vector2: Float32Array
): number {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  const len = Math.min(vector1.length, vector2.length);

  for (let i = 0; i < len; i++) {
    dotProduct += vector1[i] * vector2[i];
    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Format scoring result for readable output
 */
export function formatScoringResult(result: ScoringResult): string {
  const lines: string[] = [
    '=== SCORING RESULT ===',
    `Consistency: ${(result.consistency * 100).toFixed(1)}%`,
    `Gap Risk: ${(result.overallGapRisk * 100).toFixed(1)}%`,
    '',
    'INDEX SCORES:',
  ];

  // Sort indices by score
  const sorted = Object.entries(result.indices).sort((a, b) => b[1] - a[1]);
  for (const [indexId, score] of sorted) {
    lines.push(
      `  ${indexId}: ${(score * 100).toFixed(1)}%${score > 0.7 ? ' [HIGH]' : score < 0.3 ? ' [LOW]' : ''
      }`
    );
  }

  if (Object.values(result.gapRisks).some(r => r)) {
    lines.push('', 'GAP RISKS:');
    for (const [gapId, isRisk] of Object.entries(result.gapRisks)) {
      if (isRisk) {
        lines.push(`  - ${gapId}: ${(result.gaps[gapId] * 100).toFixed(1)}%`);
      }
    }
  }

  return lines.join('\n');
}
