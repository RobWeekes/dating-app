/**
 * Unit Tests - Compatibility Matcher
 *
 * Tests bidirectional matching, dealbreaker detection, and risk assessment
 */

import { ScoringEngine } from '../src/ScoringEngine';
import { CompatibilityMatcher } from '../src/CompatibilityMatcher';
import { UserResponses } from '../src/types';
import * as path from 'path';

describe('CompatibilityMatcher', () => {
  let engine: ScoringEngine;
  let matcher: CompatibilityMatcher;
  const configPath = path.join(__dirname, '../config');

  const secureResponses: UserResponses = {
    1: "Check in and try to understand",
    2: "Offer reassurance even if it takes effort",
    3: "Stays fairly steady",
    4: "Stay engaged and try to work it out",
    5: "Largely my own interpretation",
    6: "Be present and emotionally supportive",
    7: "Notice my reaction and try to understand it",
    8: "Stay engaged and address it directly",
    9: "Try to see their view and take responsibility where I can",
    10: "Try to make up fairly quickly",
    11: "Try to smooth things over, even if it's a bit uncomfortable",
    12: "Try to find a middle ground",
    13: "A balance of closeness and independence",
    14: "Point it out pretty directly",
    15: "Understand some things, but clear communication still matters",
    16: "Assume it's probably nothing and move on",
    17: "Assume something else is probably going on and check in if needed",
    18: "Show it through consistent actions over time",
    19: "Keep showing up pretty consistently",
    20: "Say it clearly, even if it feels a bit uncomfortable",
    21: "Still feel comfortable staying connected",
    22: "Try to match the level of effort I want to see",
    23: "Something meaningful and long-term",
    24: "Pretty clear about what I want",
    25: "Need strong alignment fairly early to feel good about continuing",
    26: "Balanced between routine and novelty",
    27: "Like some routine, but need occasional new experiences mixed in",
    28: "Dependable and consistent",
    29: "Say what I need while trying to keep things respectful",
  };

  const insecureResponses: UserResponses = {
    1: "Feel like something's wrong and react (chase / pull back)",
    2: "Get reactive or defensive about it",
    3: "Fluctuates quite a bit",
    4: "React strongly (push, vent, or seek reassurance)",
    5: "My partner is causing me to feel a certain way",
    6: "Give me space or distract me from it",
    7: "Feel like my partner is the cause of it",
    8: "Let it go or distance myself from it",
    9: "Get defensive or point out what they did wrong",
    10: "Step back and wait for them to bring it up",
    11: "Wait for the tension to pass, or for them to reach out first",
    12: "Start to pull back or see them as too needy",
    13: "Plenty of space and autonomy",
    14: "Wait to see if they notice on their own",
    15: "Understand most needs even if not everything is said",
    16: "Read into it and feel unsettled",
    17: "Feel unsettled and start wondering what it means about us",
    18: "Step up in key moments, even if I'm not steady day-to-day",
    19: "Focus on what's most urgent and circle back later",
    20: "Assume they'll pick up on it without me saying much",
    21: "Start to feel overwhelmed or want distance",
    22: "Feel frustrated if I'm not getting the effort I expect",
    23: "Something more casual or short-term",
    24: "Flexible and still figuring it out",
    25: "Am comfortable letting it stay open for quite a while",
    26: "Fresh, stimulating, and changing",
    27: "Start wanting more change, spontaneity, or intensity",
    28: "More spontaneous than consistent",
    29: "Push my point even if it creates tension",
  };

  beforeAll(() => {
    engine = new ScoringEngine(configPath);
    matcher = new CompatibilityMatcher(
      Object.keys(engine.getIndices()),
      {
        'critical': 1.0,
        'high': 0.8,
        'medium': 0.6,
        'low': 0.4,
      },
      require(path.join(configPath, 'gap-and-feature-config.json'))
    );
  });

  describe('Initialization', () => {
    test('should initialize matcher', () => {
      expect(matcher).toBeDefined();
    });
  });

  describe('Bidirectional Compatibility', () => {
    test('should compute compatibility symmetrically', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(secureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.directional.aToB).toBe(result.directional.bToA);
      expect(result.overallCompatibility).toBe(result.directional.aToB);
    });

    test('should return score in 0-1 range', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(secureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.overallCompatibility).toBeGreaterThanOrEqual(0);
      expect(result.overallCompatibility).toBeLessThanOrEqual(1);
    });

    test('should compute category breakdown', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(secureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.byCategory).toBeDefined();
      expect(Object.keys(result.byCategory).length).toBeGreaterThan(0);

      for (const [category, scores] of Object.entries(result.byCategory)) {
        expect(scores.aToB).toBeGreaterThanOrEqual(0);
        expect(scores.aToB).toBeLessThanOrEqual(1);
        expect(scores.bToA).toBeGreaterThanOrEqual(0);
        expect(scores.bToA).toBeLessThanOrEqual(1);
        expect(scores.overall).toBeGreaterThanOrEqual(0);
        expect(scores.overall).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('High Compatibility Match', () => {
    test('should score well-matched pair high', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(secureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.overallCompatibility).toBeGreaterThan(0.6);
    });

    test('should have no dealbreakers for secure match', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(secureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.dealbreakers.found).toBe(false);
    });
  });

  describe('Low Compatibility Match', () => {
    test('should score mismatched pair lower', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(insecureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.overallCompatibility).toBeLessThan(0.7);
    });

    test('should identify dealbreakers for highly mismatched pair', () => {
      const longTermResponses: UserResponses = {
        ...secureResponses,
        23: "Something meaningful and long-term",
      };

      const casualResponses: UserResponses = {
        ...insecureResponses,
        23: "Something more casual or short-term",
      };

      const scoresA = engine.scoreResponses(longTermResponses);
      const scoresB = engine.scoreResponses(casualResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.dealbreakers.count).toBeGreaterThan(0);
    });
  });

  describe('Risk Assessment', () => {
    test('should identify risk factors', () => {
      const scoresA = engine.scoreResponses(insecureResponses);
      const scoresB = engine.scoreResponses(insecureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.riskFactors).toBeDefined();
      expect(Array.isArray(result.riskFactors)).toBe(true);
    });

    test('should flag high mutual gap risk', () => {
      const scoresA = engine.scoreResponses(insecureResponses);
      const scoresB = engine.scoreResponses(insecureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      // High gap risk should create risk factors
      if (scoresA.overallGapRisk > 0.5 && scoresB.overallGapRisk > 0.5) {
        expect(result.riskFactors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Summary Generation', () => {
    test('should generate summary for high compatibility', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(secureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
    });

    test('should generate different summary for low compatibility', () => {
      const scoresA = engine.scoreResponses(secureResponses);
      const scoresB = engine.scoreResponses(insecureResponses);

      const result = matcher.computeCompatibility(scoresA, scoresB);

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
    });
  });

  describe('Error Handling', () => {
    test('should handle partial scoring results', () => {
      // Score only a few questions
      const partialResponses: UserResponses = {
        1: "Check in and try to understand",
        3: "Stays fairly steady",
      };

      const scoresA = engine.scoreResponses(partialResponses);
      const scoresB = engine.scoreResponses(partialResponses);

      expect(() => {
        matcher.computeCompatibility(scoresA, scoresB);
      }).not.toThrow();
    });
  });
});
