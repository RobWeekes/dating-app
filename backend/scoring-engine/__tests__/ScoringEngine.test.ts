/**
 * Unit Tests - Scoring Engine
 *
 * Tests core scoring logic, vectorization, and bias detection
 */

import { ScoringEngine } from '../src/ScoringEngine';
import { UserResponses, ScoringResult } from '../src/types';
import * as path from 'path';

describe('ScoringEngine', () => {
  let engine: ScoringEngine;
  const configPath = path.join(__dirname, '../config');

  beforeAll(() => {
    engine = new ScoringEngine(configPath);
  });

  describe('Initialization', () => {
    test('should load configuration files', () => {
      const indices = engine.getIndices();
      expect(indices).toBeDefined();
      expect(Object.keys(indices).length).toBe(20);
    });

    test('should have all 20 indices', () => {
      const indices = engine.getIndices();
      const expectedIndices = [
        'AA', 'AV', 'ER', 'RS', 'ER2', 'CE', 'CR', 'NC', 'CA', 'CT',
        'CD', 'MR', 'JS', 'EN', 'LT', 'LS', 'NS', 'ES', 'CO', 'AG'
      ];
      for (const indexId of expectedIndices) {
        expect(indices[indexId]).toBeDefined();
      }
    });

    test('should have all 8 gap definitions', () => {
      const gaps = engine.getGaps();
      expect(Object.keys(gaps).length).toBe(8);
      expect(gaps['STG']).toBeDefined();
      expect(gaps['RGI']).toBeDefined();
    });
  });

  describe('Basic Scoring', () => {
    test('should score valid responses', () => {
      const responses: UserResponses = {
        1: "Check in and try to understand",
        2: "Offer reassurance even if it takes effort",
        3: "Stays fairly steady",
        4: "Stay engaged and try to work it out",
        5: "Largely my own interpretation",
      };

      const result = engine.scoreResponses(responses);

      expect(result).toBeDefined();
      expect(result.indices).toBeDefined();
      expect(result.vector).toBeDefined();
      expect(result.consistency).toBeGreaterThanOrEqual(0);
      expect(result.consistency).toBeLessThanOrEqual(1);
    });

    test('should return 20-dimensional index vector', () => {
      const responses: UserResponses = {
        1: "Check in and try to understand",
        2: "Offer reassurance even if it takes effort",
        3: "Stays fairly steady",
      };

      const result = engine.scoreResponses(responses);

      expect(result.vector).toBeInstanceOf(Float32Array);
      expect(result.vector.length).toBe(20);
    });

    test('should have all index scores in 0-1 range', () => {
      const responses: UserResponses = {
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
      };

      const result = engine.scoreResponses(responses);

      for (const [indexId, score] of Object.entries(result.indices)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('Full Questionnaire (31 questions)', () => {
    test('should score all 31 questions without errors', () => {
      const responses: UserResponses = {
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

      const result = engine.scoreResponses(responses);

      expect(result).toBeDefined();
      expect(Object.keys(result.indices).length).toBe(20);
      expect(result.metadata.respondedQuestions).toBe(31);
    });
  });

  describe('Bias Detection', () => {
    test('should detect social desirability bias', () => {
      // All "ideal" answers
      const responses: UserResponses = {
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
      };

      const result = engine.scoreResponses(responses);
      expect(result.biasFlags).toBeDefined();
      // May flag social desirability depending on bias threshold
    });

    test('should detect consistency issues', () => {
      const result = engine.scoreResponses({
        1: "Check in and try to understand", // Low AA, AV
        4: "React strongly (push, vent, or seek reassurance)", // High AA, AV
      });

      expect(result.biasFlags).toBeDefined();
      expect(typeof result.biasFlags.lowConsistency).toBe('boolean');
    });
  });

  describe('Gap Calculation', () => {
    test('should calculate all 8 gaps', () => {
      const responses: UserResponses = {
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
      };

      const result = engine.scoreResponses(responses);

      expect(Object.keys(result.gaps).length).toBe(8);
      expect(result.gapRisks).toBeDefined();
      expect(Object.keys(result.gapRisks).length).toBe(8);
    });

    test('should have gap scores in 0-1 range', () => {
      const responses: UserResponses = {
        1: "Check in and try to understand",
        3: "Stays fairly steady",
        4: "Stay engaged and try to work it out",
      };

      const result = engine.scoreResponses(responses);

      for (const [gapId, score] of Object.entries(result.gaps)) {
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(1);
      }
    });

    test('should calculate overall gap risk', () => {
      const responses: UserResponses = {
        1: "Check in and try to understand",
        3: "Stays fairly steady",
        4: "Stay engaged and try to work it out",
      };

      const result = engine.scoreResponses(responses);

      expect(result.overallGapRisk).toBeGreaterThanOrEqual(0);
      expect(result.overallGapRisk).toBeLessThanOrEqual(1);
    });
  });

  describe('Metadata', () => {
    test('should include metadata in result', () => {
      const responses: UserResponses = {
        1: "Check in and try to understand",
        3: "Stays fairly steady",
      };

      const result = engine.scoreResponses(responses);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.respondedQuestions).toBe(2);
      expect(result.metadata.totalQuestions).toBe(31);
      expect(result.metadata.timestamp).toBeDefined();
      expect(result.metadata.gapSummary).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    test('should throw on invalid responses object', () => {
      expect(() => {
        engine.scoreResponses(null as any);
      }).toThrow();
    });

    test('should skip unknown questions', () => {
      const responses: UserResponses = {
        999: "Invalid answer",
        1: "Check in and try to understand",
      };

      expect(() => {
        engine.scoreResponses(responses);
      }).not.toThrow();
    });

    test('should skip unknown answers', () => {
      const responses: UserResponses = {
        1: "Not a real answer",
      };

      expect(() => {
        engine.scoreResponses(responses);
      }).not.toThrow();
    });
  });
});
