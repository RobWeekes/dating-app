/**
 * Essential Scoring Engine - Public API
 *
 * Plug-and-play exports for the complete scoring system
 */

export { ScoringEngine } from './ScoringEngine';
export { GapCalculator } from './GapCalculator';
export { CompatibilityMatcher } from './CompatibilityMatcher';

export {
  // Configuration types
  IndexConfig,
  WeightConfig,
  ItemDeltaConfig,
  GapAndFeatureConfig,
  IndexDefinition,
  SectionInfo,
  QuestionConfig,
  GapDefinition,

  // Scoring types
  UserResponses,
  IndexScores,
  ScoringResult,
  BiasDetection,
  ScoringMetadata,
  GapScores,
  GapRisks,
  GapResult,

  // Compatibility types
  CompatibilityResult,
  DealbreakPattern,
  RiskFactor,
  DirectionalCompatibility,
  CompatibilityBreakdown,
  Dealbreakers,

  // Utility types
  NormalizationOptions,
  VectorOptions,

  // Batch types
  BatchScoringRequest,
  BatchScoringResult,
  BatchCompatibilityRequest,
  BatchCompatibilityResult,
} from './types';

export {
  // Math utilities
  sigmoid,
  normalizeScore,
  clamp,
  mean,
  standardDeviation,
  geometricMean,
  euclideanDistance,
  cosineSimilarity,

  // Config utilities
  ConfigLoader,

  // Vector utilities
  createIndexVector,
  createExtendedVector,

  // Response utilities
  getResponseIndex,
  mapResponseIndexToScore,

  // Formatting
  formatScoringResult,
} from './utils';
