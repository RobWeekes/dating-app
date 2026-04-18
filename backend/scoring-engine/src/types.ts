/**
 * Essential2 Scoring Engine - TypeScript Type Definitions
 *
 * Comprehensive type system for the 20-index relationship compatibility
 * scoring engine with vectorized output for ANN indexing.
 */

// ============= CONFIGURATION TYPES =============

export interface IndexDefinition {
  id: string;
  name: string;
  weight: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface IndexConfig {
  indices: Record<string, IndexDefinition>;
  indexImportance: Record<string, number>;
  metadata: {
    totalIndices: number;
    section1: SectionInfo;
    section2: SectionInfo;
    section3: SectionInfo;
    section4: SectionInfo;
    section5: SectionInfo;
  };
}

export interface SectionInfo {
  name: string;
  indices: string[];
}

export interface WeightConfig {
  weightMultipliers: {
    strong: number;
    medium: number;
    weak: number;
  };
  description: string;
  normalizationSettings: {
    method: 'sigmoid' | 'linear';
    sigmoidScaleFactor: number;
    min: number;
    max: number;
  };
  metadata: Record<string, string>;
}

export interface IndexMapping {
  weight: 'strong' | 'medium' | 'weak';
  direction: 1 | -1;
}

export interface ResponseMapping {
  [answerText: string]: Record<string, number>; // indexId -> delta value
}

export interface QuestionConfig {
  text: string;
  section: string;
  critical: boolean;
  indices: Record<string, IndexMapping>;
  responseMapping: ResponseMapping;
}

export interface ItemDeltaConfig {
  questionIndexMappings: Record<string, QuestionConfig>;
}

export interface GapDefinition {
  id: string;
  name: string;
  description: string;
  meaning: string;
  traitQ: number;
  stateQ?: number;
  stateQs?: number[] | null;
  direction: 1 | -1;
  riskThreshold: number;
}

export interface GapAndFeatureConfig {
  gapDefinitions: Record<string, GapDefinition>;
  gapSeverityLevels: Record<
    string,
    { range?: [number, number | null]; description: string }
  >;
  interactionPenalties: Record<
    string,
    {
      gaps: string[];
      penaltyValue: number;
      description: string;
    }
  >;
  metadata: {
    totalGaps: number;
    responseScoring: {
      A: number;
      B: number;
      C: number;
      description: string;
    };
  };
}

// ============= SCORING TYPES =============

export type IndexId = string;
export type GapId = string;

export interface UserResponses {
  [questionId: number]: string; // Question ID -> Answer text
}

export interface IndexScores {
  [indexId: string]: number; // 0-1 scale
}

export interface GapScores {
  [gapId: string]: number; // 0-1 scale
}

export interface GapRisks {
  [gapId: string]: boolean;
}

export interface GapResult {
  value: number;
  traitScore: number;
  stateScore: number;
  isRisk: boolean;
  severity: 'minimal' | 'low' | 'moderate' | 'high' | 'critical';
}

export interface BiasDetection {
  consistency: number; // 0-1
  flags: {
    socialDesirabilityBias: boolean;
    acquiescenceBias: boolean;
    lowConsistency: boolean;
    responseExtremity: boolean;
  };
}

export interface ScoringMetadata {
  respondedQuestions: number;
  totalQuestions: number;
  patterns: string[];
  gapSummary: string;
  timestamp: string;
}

export interface ScoringResult {
  indices: IndexScores;
  vector: Float32Array; // 20-dimensional vector for ANN
  consistency: number;
  biasFlags: BiasDetection['flags'];
  gaps: GapScores;
  gapRisks: GapRisks;
  overallGapRisk: number; // 0-1
  metadata: ScoringMetadata;
}

// ============= COMPATIBILITY TYPES =============

export interface DealbreakPattern {
  name: string;
  indices: string[];
  description: string;
  penalty: number;
}

export interface RiskFactor {
  name: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
}

export interface DirectionalCompatibility {
  score: number; // 0-1, overall from user A's perspective
  byCategory: Record<string, number>;
}

export interface Dealbreakers {
  found: boolean;
  patterns: DealbreakPattern[];
  count: number;
}

export interface CompatibilityBreakdown {
  [indexId: string]: {
    aToB: number;
    bToA: number;
    overall: number;
  };
}

export interface CompatibilityResult {
  overallCompatibility: number; // 0-1, geometric mean
  directional: {
    aToB: number;
    bToA: number;
  };
  byCategory: CompatibilityBreakdown;
  dealbreakers: Dealbreakers;
  riskFactors: RiskFactor[];
  summary: string;
}

// ============= UTILITY TYPES =============

export interface NormalizationOptions {
  method: 'sigmoid' | 'linear';
  scaleFactor?: number;
}

export interface VectorOptions {
  include20Indices: boolean;
  includeGaps: boolean;
  includeMetadata: boolean;
}

// ============= BATCH PROCESSING TYPES =============

export interface BatchScoringRequest {
  userId: string | number;
  responses: UserResponses;
}

export interface BatchScoringResult {
  userId: string | number;
  result: ScoringResult;
  error?: string;
}

export interface BatchCompatibilityRequest {
  userAId: string | number;
  userBId: string | number;
  scoresA: ScoringResult;
  scoresB: ScoringResult;
}

export interface BatchCompatibilityResult {
  userAId: string | number;
  userBId: string | number;
  compatibility: CompatibilityResult;
  error?: string;
}
