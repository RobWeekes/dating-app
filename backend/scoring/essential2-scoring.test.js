/**
 * Essential Questionnaire 2 - Scoring System Tests
 * Validates scoring, bias detection, and compatibility computation
 */

const Essential2Scorer = require('./essential2-scoring-engine');
const CompatibilityMatcher = require('./compatibility-matcher');

// Test Responses - Emotionally secure, communicative person
const secureUserResponses = {
  1: 'Check in and try to understand',
  2: 'Offer reassurance even if it takes effort',
  3: 'Stays fairly steady',
  4: 'Stay engaged and try to work it out',
  5: 'Largely my own interpretation',
  6: 'Be present and emotionally supportive',
  7: 'Notice my reaction and try to understand it',
  8: 'Stay engaged and address it directly',
  9: 'Try to see their view and take responsibility where I can',
  10: 'Try to make up fairly quickly',
  11: 'Try to smooth things over, even if it\'s a bit uncomfortable',
  12: 'Try to find a middle ground',
  13: 'A balance of closeness and independence',
  14: 'Point it out pretty directly',
  15: 'Not be expected to know unless it\'s said directly',
  16: 'Assume it\'s probably nothing and move on',
  17: 'Assume something else is probably going on and check in if needed',
  18: 'Show it through consistent actions over time',
  19: 'Keep showing up pretty consistently',
  20: 'Say it clearly, even if it feels a bit uncomfortable',
  21: 'Still feel comfortable staying connected',
  22: 'Try to match the level of effort I want to see',
  23: 'Something meaningful and long-term',
  24: 'Pretty clear about what I want',
  25: 'Need strong alignment fairly early to feel good about continuing',
  26: 'Balanced between routine and novelty',
  27: 'Like some routine, but need occasional new experiences mixed in',
  28: 'Dependable and consistent',
  29: 'Say what I need while trying to keep things respectful'
};

// Test Responses - Anxiously attached, avoidant person
const anxiousUserResponses = {
  1: 'Feel like something\'s wrong and react (chase / pull back)',
  2: 'Get reactive or defensive about it',
  3: 'Tends toward worry, tension, or feeling low',
  4: 'React strongly (push, vent, or seek reassurance)',
  5: 'My partner is causing me to feel a certain way',
  6: 'Be present and emotionally supportive',
  7: 'Feel like my partner is the cause of it',
  8: 'Let it go or distance myself from it',
  9: 'Get defensive or point out what they did wrong',
  10: 'Step back and wait for them to bring it up',
  11: 'Wait for the tension to pass, or for them to reach out first',
  12: 'Start to pull back or see them as too needy',
  13: 'Plenty of space and autonomy',
  14: 'Wait to see if they notice on their own',
  15: 'Understand most needs even if not everything is said',
  16: 'Read into it and feel unsettled',
  17: 'Feel unsettled and start wondering what it means about us',
  18: 'Feel it strongly, even if my actions aren\'t always consistent',
  19: 'Try to stay connected, but I can become less responsive',
  20: 'Assume they\'ll pick up on it without me saying much',
  21: 'Start to feel overwhelmed or want distance',
  22: 'Feel frustrated if I\'m not getting the effort I expect',
  23: 'Openness to either casual or serious, depending on fit',
  24: 'Flexible and still figuring it out',
  25: 'Am comfortable letting it stay open for quite a while',
  26: 'Fresh, stimulating, and changing',
  27: 'Start wanting more change, spontaneity, or intensity',
  28: 'Warm but a little unpredictable',
  29: 'Keep the peace even if I hold things in'
};

// Test Responses - Biased (social desirability)
const biasedUserResponses = {
  // Always choosing the "best" answer
  1: 'Check in and try to understand',
  2: 'Offer reassurance even if it takes effort',
  3: 'Stays fairly steady',
  4: 'Stay engaged and try to work it out',
  5: 'Largely my own interpretation',
  6: 'Be present and emotionally supportive',
  7: 'Notice my reaction and try to understand it',
  8: 'Stay engaged and address it directly',
  9: 'Try to see their view and take responsibility where I can',
  10: 'Try to make up fairly quickly',
  11: 'Try to smooth things over, even if it\'s a bit uncomfortable',
  12: 'Try to find a middle ground',
  13: 'A balance of closeness and independence',
  14: 'Point it out pretty directly',
  15: 'Not be expected to know unless it\'s said directly',
  16: 'Assume it\'s probably nothing and move on',
  17: 'Assume something else is probably going on and check in if needed',
  18: 'Show it through consistent actions over time',
  19: 'Keep showing up pretty consistently',
  20: 'Say it clearly, even if it feels a bit uncomfortable',
  21: 'Still feel comfortable staying connected',
  22: 'Try to match the level of effort I want to see',
  23: 'Something meaningful and long-term',
  24: 'Pretty clear about what I want',
  25: 'Need strong alignment fairly early to feel good about continuing',
  26: 'Balanced between routine and novelty',
  27: 'Like some routine, but need occasional new experiences mixed in',
  28: 'Dependable and consistent',
  29: 'Say what I need while trying to keep things respectful'
};

/**
 * Run all tests
 */
function runTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Essential Questionnaire 2 - Scoring System Tests');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Initialize
  const scorer = new Essential2Scorer();
  const matcher = new CompatibilityMatcher();

  // Test 1: Score Secure User
  console.log('TEST 1: Scoring Emotionally Secure User');
  console.log('─────────────────────────────────────────────────────────────');
  testScoreUser(scorer, 'Secure User', secureUserResponses);

  // Test 2: Score Anxious User
  console.log('\nTEST 2: Scoring Anxious/Avoidant User');
  console.log('─────────────────────────────────────────────────────────────');
  testScoreUser(scorer, 'Anxious User', anxiousUserResponses);

  // Test 3: Bias Detection
  console.log('\nTEST 3: Bias Detection');
  console.log('─────────────────────────────────────────────────────────────');
  testBiasDetection(scorer, 'Biased User', biasedUserResponses);

  // Test 4: Compatibility Matching
  console.log('\nTEST 4: Compatibility Matching - Secure vs Anxious');
  console.log('─────────────────────────────────────────────────────────────');
  testCompatibility(scorer, matcher, 'Secure User', 'Anxious User',
    secureUserResponses, anxiousUserResponses);

  // Test 5: Self-Compatibility (should be high)
  console.log('\nTEST 5: Self-Compatibility (Same User)');
  console.log('─────────────────────────────────────────────────────────────');
  testCompatibility(scorer, matcher, 'Secure User', 'Secure User (Clone)',
    secureUserResponses, secureUserResponses);

  // Test 7: Behavioral Gap Calculations
  console.log('\nTEST 7: Behavioral Gap Calculations');
  console.log('─────────────────────────────────────────────────────────────');
  testGapCalculations(scorer, 'Secure User', secureUserResponses, 'Anxious User', anxiousUserResponses);

  // Test 8: Gap-Based Risk Penalties
  console.log('\nTEST 8: Gap-Based Risk Penalties in Matching');
  console.log('─────────────────────────────────────────────────────────────');
  testGapPenalties(scorer, matcher, 'Secure User', 'Anxious User',
    secureUserResponses, anxiousUserResponses);

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  All Tests Complete');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

function testScoreUser(scorer, userName, responses) {
  try {
    const result = scorer.scoreResponses(responses);

    console.log(`✓ Scored ${userName} successfully`);
    console.log(`  Responses processed: ${result.metadata.respondedQuestions}/${result.metadata.totalQuestions}`);
    console.log(`  Consistency: ${(result.consistency * 100).toFixed(1)}%`);
    console.log(`\n  Index Scores (Top 5):`);

    // Sort by score and show top 5
    const sorted = Object.entries(result.indices)
      .sort((a, b) => Math.abs(b[1] - 0.5) - Math.abs(a[1] - 0.5))
      .slice(0, 5);

    for (const [indexId, score] of sorted) {
      const indicator = score > 0.65 ? '↑↑' : score > 0.55 ? '↑' :
        score < 0.35 ? '↓↓' : score < 0.45 ? '↓' : '→';
      console.log(`    ${indexId}: ${(score * 100).toFixed(1)}% ${indicator}`);
    }

    console.log(`\n  Bias Flags:`);
    for (const [flag, detected] of Object.entries(result.biasFlags)) {
      const symbol = detected ? '⚠️' : '✓';
      console.log(`    ${symbol} ${flag}: ${detected}`);
    }

    console.log(`\n  Category Scores:`);
    const categories = scorer.createCategoryScores(result.indices);
    for (const [catKey, catData] of Object.entries(categories)) {
      console.log(`    ${catData.name}: ${(catData.score * 100).toFixed(1)}%`);
    }

    return result;
  } catch (err) {
    console.error(`✗ Error scoring ${userName}:`, err.message);
    return null;
  }
}

function testBiasDetection(scorer, userName, responses) {
  try {
    const result = scorer.scoreResponses(responses);

    console.log(`✓ Bias detection completed for ${userName}`);
    console.log(`  Consistency Score: ${(result.consistency * 100).toFixed(1)}%`);

    const hasBias = Object.values(result.biasFlags).some(v => v === true);
    const biasCount = Object.values(result.biasFlags).filter(v => v === true).length;

    if (hasBias) {
      console.log(`  ⚠️  Detected ${biasCount} bias flag(s):`);
      for (const [flag, detected] of Object.entries(result.biasFlags)) {
        if (detected) {
          console.log(`    • ${flag}`);
        }
      }
    } else {
      console.log(`  ✓ No significant biases detected`);
    }

    // Show score distribution
    const scores = Object.values(result.indices);
    const avgScore = scores.reduce((a, b) => a + b) / scores.length;
    const extreme = scores.filter(s => s < 0.2 || s > 0.8).length;

    console.log(`\n  Score Distribution:`);
    console.log(`    Average: ${(avgScore * 100).toFixed(1)}%`);
    console.log(`    Extreme scores: ${extreme}/20`);
    console.log(`    Range: ${(Math.min(...scores) * 100).toFixed(1)}% - ${(Math.max(...scores) * 100).toFixed(1)}%`);

    return result;
  } catch (err) {
    console.error(`✗ Error in bias detection:`, err.message);
    return null;
  }
}

function testCompatibility(scorer, matcher, userAName, userBName, responsesA, responsesB) {
  try {
    const resultA = scorer.scoreResponses(responsesA);
    const resultB = scorer.scoreResponses(responsesB);

    const compat = matcher.computeCompatibility(resultA.indices, resultB.indices);

    console.log(`✓ Compatibility computed: ${userAName} ↔ ${userBName}`);
    console.log(`  Overall Compatibility: ${(compat.overallCompatibility * 100).toFixed(1)}%`);
    console.log(`  A→B Directional: ${(compat.directional.aToB * 100).toFixed(1)}%`);
    console.log(`  B→A Directional: ${(compat.directional.bToA * 100).toFixed(1)}%`);

    console.log(`\n  Top 5 Compatible Indices:`);
    const topCompat = Object.entries(compat.byCategory)
      .sort((a, b) => b[1].overall - a[1].overall)
      .slice(0, 5);

    for (const [indexId, compats] of topCompat) {
      console.log(`    ${indexId}: ${(compats.overall * 100).toFixed(1)}%`);
    }

    console.log(`\n  Dealbreakers: ${compat.dealbreakers.length > 0 ? '⚠️' : '✓'}`);
    if (compat.dealbreakers.length > 0) {
      for (const db of compat.dealbreakers) {
        console.log(`    • ${db.name} (${db.severity})`);
      }
    } else {
      console.log(`    None detected`);
    }

    console.log(`\n  Risk Factors: ${compat.riskFactors.riskCount > 0 ? '⚠️' : '✓'}`);
    if (compat.riskFactors.riskCount > 0) {
      for (const risk of compat.riskFactors.risks) {
        console.log(`    • ${risk.name} (${risk.severity})`);
      }
    } else {
      console.log(`    None detected`);
    }

    console.log(`\n  Summary: ${compat.summary}`);

    return compat;
  } catch (err) {
    console.error(`✗ Error computing compatibility:`, err.message);
    return null;
  }
}

function testVectorDimensions(scorer, responses) {
  try {
    const result = scorer.scoreResponses(responses);

    console.log(`✓ Response vector created successfully`);
    console.log(`  Vector dimensions: ${result.vector.length}`);
    console.log(`  Vector size: ${(result.vector.byteLength / 1024).toFixed(2)} KB`);

    console.log(`\n  Vector structure:`);
    console.log(`    [0-19]   Index scores: [${Array.from(result.vector.slice(0, 20)).map(v => v.toFixed(2)).join(', ')}]`);
    console.log(`    [20]     Consistency: ${result.vector[20].toFixed(2)}`);
    console.log(`    [21-24]  Bias flags: [${Array.from(result.vector.slice(21, 25)).map(v => v.toFixed(0)).join(', ')}]`);
    console.log(`    [25-34]  Risk scores: [${Array.from(result.vector.slice(25, 35)).map(v => v.toFixed(2)).join(', ')}]`);

    return result;
  } catch (err) {
    console.error(`✗ Error creating vector:`, err.message);
    return null;
  }
}

function testGapCalculations(scorer, userName1, responses1, userName2, responses2) {
  try {
    const result1 = scorer.scoreResponses(responses1);
    const result2 = scorer.scoreResponses(responses2);

    console.log(`✓ Gap calculations complete for ${userName1} and ${userName2}`);
    console.log(`\n  ${userName1} - Behavioral Gaps:`);

    const gapOrder = ['STG', 'RGI', 'RG2', 'ERG', 'CG2', 'EEG', 'ReG', 'CG'];
    for (const gapId of gapOrder) {
      const gapScore = result1.gaps[gapId];
      const isRisk = result1.gapRisks[gapId];
      const riskIndicator = isRisk ? '⚠️ RISK' : '✓';
      console.log(`    ${gapId}: ${(gapScore * 100).toFixed(1)}% ${riskIndicator}`);
    }

    console.log(`\n  Overall Gap Risk: ${(result1.overallGapRisk * 100).toFixed(1)}%`);
    console.log(`  Gap Summary: ${result1.metadata.gapSummary}`);

    console.log(`\n  ${userName2} - Behavioral Gaps:`);
    for (const gapId of gapOrder) {
      const gapScore = result2.gaps[gapId];
      const isRisk = result2.gapRisks[gapId];
      const riskIndicator = isRisk ? '⚠️ RISK' : '✓';
      console.log(`    ${gapId}: ${(gapScore * 100).toFixed(1)}% ${riskIndicator}`);
    }

    console.log(`\n  Overall Gap Risk: ${(result2.overallGapRisk * 100).toFixed(1)}%`);
    console.log(`  Gap Summary: ${result2.metadata.gapSummary}`);

    return { result1, result2 };
  } catch (err) {
    console.error(`✗ Error calculating gaps:`, err.message);
    return null;
  }
}

function testGapPenalties(scorer, matcher, userName1, userName2, responses1, responses2) {
  try {
    const result1 = scorer.scoreResponses(responses1);
    const result2 = scorer.scoreResponses(responses2);

    // Compute compatibility WITH gap penalties
    const compatibility = matcher.computeCompatibility(
      result1.indices,
      result2.indices,
      result1.gaps,
      result2.gaps
    );

    console.log(`✓ Gap-based risk assessment complete`);
    console.log(`\n  Overall Compatibility: ${(compatibility.overallCompatibility * 100).toFixed(1)}%`);

    console.log(`\n  Risk Factors with Gap Penalties:`);
    if (compatibility.riskFactors.risks.length === 0) {
      console.log('    No significant risk factors detected');
    } else {
      for (const risk of compatibility.riskFactors.risks) {
        const severity = risk.severity === 'high' ? '🔴' :
          risk.severity === 'medium' ? '🟡' : '🟢';
        console.log(`    ${severity} ${risk.name} (${risk.severity})`);
        console.log(`       ${risk.description}`);
      }
    }

    console.log(`\n  Total Risks: ${compatibility.riskFactors.riskCount}`);
    console.log(`  High-Severity Risks: ${compatibility.riskFactors.hasHighRisk ? 'Yes' : 'No'}`);

    return compatibility;
  } catch (err) {
    console.error(`✗ Error computing gap penalties:`, err.message);
    return null;
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
