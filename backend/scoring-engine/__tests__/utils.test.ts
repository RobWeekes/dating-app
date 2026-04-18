/**
 * Unit Tests - Utilities
 *
 * Tests math functions and helper utilities
 */

import {
  sigmoid,
  normalizeScore,
  clamp,
  mean,
  standardDeviation,
  geometricMean,
  euclideanDistance,
  cosineSimilarity,
} from '../src/utils';

describe('Utility Functions', () => {
  describe('Sigmoid', () => {
    test('should return 0.5 for x=0', () => {
      const result = sigmoid(0);
      expect(result).toBeCloseTo(0.5, 2);
    });

    test('should return close to 1 for large x', () => {
      const result = sigmoid(10);
      expect(result).toBeGreaterThan(0.99);
    });

    test('should return close to 0 for large negative x', () => {
      const result = sigmoid(-10);
      expect(result).toBeLessThan(0.01);
    });

    test('should respect scale factor', () => {
      const result1 = sigmoid(1, 1);
      const result2 = sigmoid(1, 2);
      expect(result2).toBeGreaterThan(result1);
    });
  });

  describe('normalizeScore', () => {
    test('should normalize using sigmoid method', () => {
      const result = normalizeScore(0, { method: 'sigmoid' });
      expect(result).toBeCloseTo(0.5, 2);
    });

    test('should normalize using linear method', () => {
      const result = normalizeScore(0, { method: 'linear' });
      expect(result).toBeCloseTo(0.5, 2);
    });

    test('should return values in 0-1 range', () => {
      for (let i = -5; i <= 5; i++) {
        const result = normalizeScore(i);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      }
    });
  });

  describe('clamp', () => {
    test('should clamp to range', () => {
      expect(clamp(0.5, 0, 1)).toBe(0.5);
      expect(clamp(-0.5, 0, 1)).toBe(0);
      expect(clamp(1.5, 0, 1)).toBe(1);
    });

    test('should use default 0-1 range', () => {
      expect(clamp(0.5)).toBe(0.5);
      expect(clamp(-0.5)).toBe(0);
      expect(clamp(1.5)).toBe(1);
    });
  });

  describe('mean', () => {
    test('should calculate arithmetic mean', () => {
      expect(mean([1, 2, 3, 4, 5])).toBe(3);
      expect(mean([10, 20, 30])).toBe(20);
    });

    test('should return 0 for empty array', () => {
      expect(mean([])).toBe(0);
    });
  });

  describe('standardDeviation', () => {
    test('should calculate standard deviation', () => {
      const result = standardDeviation([1, 2, 3, 4, 5]);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(3);
    });

    test('should return 0 for identical values', () => {
      expect(standardDeviation([5, 5, 5, 5])).toBe(0);
    });
  });

  describe('geometricMean', () => {
    test('should calculate geometric mean', () => {
      expect(geometricMean(4, 9)).toBe(6);
      expect(geometricMean(1, 1)).toBe(1);
    });

    test('should be symmetric', () => {
      expect(geometricMean(2, 8)).toBe(geometricMean(8, 2));
    });
  });

  describe('euclideanDistance', () => {
    test('should calculate distance between vectors', () => {
      const v1 = new Float32Array([0, 0]);
      const v2 = new Float32Array([3, 4]);
      expect(euclideanDistance(v1, v2)).toBe(5);
    });

    test('should return 0 for identical vectors', () => {
      const v1 = new Float32Array([1, 2, 3]);
      const v2 = new Float32Array([1, 2, 3]);
      expect(euclideanDistance(v1, v2)).toBe(0);
    });

    test('should handle different length vectors', () => {
      const v1 = new Float32Array([1, 2, 3]);
      const v2 = new Float32Array([1, 2]);
      expect(() => euclideanDistance(v1, v2)).not.toThrow();
    });
  });

  describe('cosineSimilarity', () => {
    test('should return 1 for identical vectors', () => {
      const v1 = new Float32Array([1, 0, 0]);
      const v2 = new Float32Array([1, 0, 0]);
      expect(cosineSimilarity(v1, v2)).toBeCloseTo(1, 5);
    });

    test('should return 0 for orthogonal vectors', () => {
      const v1 = new Float32Array([1, 0]);
      const v2 = new Float32Array([0, 1]);
      expect(cosineSimilarity(v1, v2)).toBeCloseTo(0, 5);
    });

    test('should be between 0 and 1 for valid unit vectors', () => {
      const v1 = new Float32Array([0.6, 0.8]);
      const v2 = new Float32Array([0.8, 0.6]);
      const result = cosineSimilarity(v1, v2);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });
});
