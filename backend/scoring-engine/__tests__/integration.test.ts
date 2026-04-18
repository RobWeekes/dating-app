/**
 * Integration Test - Full Scoring Pipeline
 *
 * Tests complete workflow: load config → score user → match users
 */

import { ScoringEngine } from '../src/ScoringEngine';
import { CompatibilityMatcher } from '../src/CompatibilityMatcher';
import { UserResponses } from '../src/types';
import * as path from 'path';

describe('Full Scoring Pipeline', () => {
  const configPath = path.join(__dirname, '../config');

  // Test user profiles
  const aliceResponses: UserResponses = {
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

  const bobResponses: UserResponses = {
    1: "Give them space but stay available",
    2: "Feel myself pulling back or getting drained",
    3: "Stays fairly steady",
    4: "Pull back to settle myself first",
    5: "A mix of my perspective and my partner's actions",
    6: "Help me think it through or take action",
    7: "Feel caught between my reaction and what my partner did",
    8: "Take some space before dealing with it",
    9: "Explain my side first, then come back to fix things",
    10: "Need some time, but come back to it",
    11: "Give it some time, then come back and reconnect",
    12: "Try to find a middle ground",
    13: "A balance of closeness and independence",
    14: "Hint at it and hope it's picked up",
    15: "Understand most needs even if not everything is said",
    16: "Notice it and want some clarity",
    17: "Notice it and feel unsure until I understand why",
    18: "Feel it strongly, even if my actions aren't always consistent",
    19: "Try to stay connected, but I can become less responsive",
    20: "Try to imply it or ease into it",
    21: "Need a bit of space to recharge",
    22: "Notice it, but adjust depending on the situation",
    23: "Openness to either casual or serious, depending on fit",
    24: "Open, but within some limits",
    25: "Can keep exploring if the mismatch doesn't seem too big",
    26: "Balanced between routine and novelty",
    27: "Like some routine, but need occasional new experiences mixed in",
    28: "Warm but a little unpredictable",
    29: "Keep the peace even if I hold things in",
  };

  const charlieResponses: UserResponses = {
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

  test('should load configuration without errors', () => {
    expect(() => {
      new ScoringEngine(configPath);
    }).not.toThrow();
  });

  test('should score multiple users without errors', () => {
    const engine = new ScoringEngine(configPath);

    const resultA = engine.scoreResponses(aliceResponses);
    const resultB = engine.scoreResponses(bobResponses);
    const resultC = engine.scoreResponses(charlieResponses);

    expect(resultA).toBeDefined();
    expect(resultB).toBeDefined();
    expect(resultC).toBeDefined();
  });

  test('should match highly compatible users', () => {
    const engine = new ScoringEngine(configPath);
    const matcher = new CompatibilityMatcher(
      Object.keys(engine.getIndices()),
      {
        'critical': 1.0,
        'high': 0.8,
        'medium': 0.6,
        'low': 0.4,
      },
      require(path.join(configPath, 'gap-and-feature-config.json'))
    );

    const scoreA = engine.scoreResponses(aliceResponses);
    const scoreB = engine.scoreResponses(bobResponses);

    const compatibility = matcher.computeCompatibility(scoreA, scoreB);

    expect(compatibility.overallCompatibility).toBeGreaterThan(0.5);
    expect(compatibility.summary).toBeDefined();
    console.log(`Alice & Bob compatibility: ${(compatibility.overallCompatibility * 100).toFixed(1)}%`);
  });

  test('should detect low compatibility between mismatched users', () => {
    const engine = new ScoringEngine(configPath);
    const matcher = new CompatibilityMatcher(
      Object.keys(engine.getIndices()),
      {
        'critical': 1.0,
        'high': 0.8,
        'medium': 0.6,
        'low': 0.4,
      },
      require(path.join(configPath, 'gap-and-feature-config.json'))
    );

    const scoreA = engine.scoreResponses(aliceResponses);
    const scoreC = engine.scoreResponses(charlieResponses);

    const compatibility = matcher.computeCompatibility(scoreA, scoreC);

    expect(compatibility.overallCompatibility).toBeLessThan(0.7);
    expect(compatibility.summary).toBeDefined();
    console.log(`Alice & Charlie compatibility: ${(compatibility.overallCompatibility * 100).toFixed(1)}%`);
  });

  test('should produce consistent results for identical inputs', () => {
    const engine = new ScoringEngine(configPath);

    const result1 = engine.scoreResponses(aliceResponses);
    const result2 = engine.scoreResponses(aliceResponses);

    // Index scores should be identical
    for (const indexId of Object.keys(result1.indices)) {
      expect(result1.indices[indexId]).toBe(result2.indices[indexId]);
    }

    // Consistency scores should be identical
    expect(result1.consistency).toBe(result2.consistency);
  });

  test('should handle batch scoring', () => {
    const engine = new ScoringEngine(configPath);

    const users = [
      { id: 'alice', responses: aliceResponses },
      { id: 'bob', responses: bobResponses },
      { id: 'charlie', responses: charlieResponses },
    ];

    const results = users.map(user => ({
      userId: user.id,
      score: engine.scoreResponses(user.responses),
    }));

    expect(results).toHaveLength(3);
    expect(results.every(r => r.score !== undefined)).toBe(true);
  });

  test('should produce valid vectors for ANN indexing', () => {
    const engine = new ScoringEngine(configPath);

    const result = engine.scoreResponses(aliceResponses);

    expect(result.vector).toBeInstanceOf(Float32Array);
    expect(result.vector.length).toBe(20);

    // All values should be valid floats
    for (let i = 0; i < result.vector.length; i++) {
      expect(Number.isFinite(result.vector[i])).toBe(true);
      expect(result.vector[i]).toBeGreaterThanOrEqual(0);
      expect(result.vector[i]).toBeLessThanOrEqual(1);
    }
  });

  test('should scale to processing 100 user profiles', () => {
    const engine = new ScoringEngine(configPath);

    const startTime = Date.now();

    for (let i = 0; i < 100; i++) {
      engine.scoreResponses(aliceResponses);
    }

    const elapsedTime = Date.now() - startTime;
    console.log(`Processed 100 profiles in ${elapsedTime}ms (${(elapsedTime / 100).toFixed(2)}ms per profile)`);

    // Should complete in reasonable time (less than 1 second for 100 profiles)
    expect(elapsedTime).toBeLessThan(1000);
  });

  test('should generate actionable summary for relationship coaching', () => {
    const engine = new ScoringEngine(configPath);
    const matcher = new CompatibilityMatcher(
      Object.keys(engine.getIndices()),
      {
        'critical': 1.0,
        'high': 0.8,
        'medium': 0.6,
        'low': 0.4,
      },
      require(path.join(configPath, 'gap-and-feature-config.json'))
    );

    const scoreA = engine.scoreResponses(aliceResponses);
    const scoreB = engine.scoreResponses(bobResponses);

    const compatibility = matcher.computeCompatibility(scoreA, scoreB);

    console.log('\n=== COMPATIBILITY REPORT ===');
    console.log(`Overall: ${(compatibility.overallCompatibility * 100).toFixed(1)}%`);
    console.log(`Summary: ${compatibility.summary}`);

    if (compatibility.dealbreakers.found) {
      console.log('Dealbreakers:');
      for (const pattern of compatibility.dealbreakers.patterns) {
        console.log(`  - ${pattern.name}: ${pattern.description}`);
      }
    }

    if (compatibility.riskFactors.length > 0) {
      console.log('Risk Factors:');
      for (const risk of compatibility.riskFactors) {
        console.log(`  - ${risk.name} (${risk.severity}): ${risk.description}`);
      }
    }

    expect(compatibility).toBeDefined();
  });
});
