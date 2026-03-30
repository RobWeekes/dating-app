/**
 * MVP Questionnaire Scoring Service
 * Calculates compatibility scores between users based on MVP questionnaire responses
 *
 * MVP SCORING WEIGHTS:
 * - Personality: 25%
 * - Core Values: 30%
 * - Family Planning: 25%
 * - Financial Attitudes: 20%
 * - Lifestyle Preferences: 5% (adjustment)
 * - Work-Life Balance: 5% (adjustment)
 * - Health & Wellness: 2.5% (adjustment)
 * - Physical Preferences: 2.5% (adjustment)
 */

const { QuestionnaireResponse, Answer, Question, Questionnaire, User, MVPQuestionnaireScore } = require('../db/models');

class MVPQuestionnaireScorer {
  /**
   * Calculate compatibility score between two users
   * @param {number} userId1 - First user ID
   * @param {number} userId2 - Second user ID
   * @returns {Promise<Object>} Compatibility score object
   */
  static async calculateCompatibility(userId1, userId2) {
    try {
      // Fetch both users' questionnaire responses
      const user1Responses = await this.getUserResponses(userId1, 'MVP Questionnaire');
      const user2Responses = await this.getUserResponses(userId2, 'MVP Questionnaire');

      if (!user1Responses || !user2Responses) {
        throw new Error('One or both users have not completed the MVP questionnaire');
      }

      // Calculate individual dimension scores
      const scores = {
        personalityScore: this.calculatePersonalityScore(user1Responses, user2Responses),
        valuesScore: this.calculateValuesScore(user1Responses, user2Responses),
        familyScore: this.calculateFamilyScore(user1Responses, user2Responses),
        financialScore: this.calculateFinancialScore(user1Responses, user2Responses),
        lifestyleScore: this.calculateLifestyleScore(user1Responses, user2Responses),
        workLifeScore: this.calculateWorkLifeScore(user1Responses, user2Responses),
        healthScore: this.calculateHealthScore(user1Responses, user2Responses),
        physicalScore: this.calculatePhysicalScore(user1Responses, user2Responses),
      };

      // Calculate weighted overall score
      const overallScore = this.calculateOverallScore(scores);

      // Check for critical red flags
      const { redFlags, incompatibilityReasons } = this.checkRedFlags(
        user1Responses,
        user2Responses
      );

      // Calculate match rating (1-5 stars)
      const matchRating = this.calculateMatchRating(overallScore, redFlags);

      // Adjust score if critical incompatibilities
      let adjustedScore = overallScore;
      if (redFlags.length > 0) {
        // Use additive penalties instead of cascading multipliers
        const criticalCount = redFlags.filter(f => f.severity === 'critical').length;
        const significantCount = redFlags.filter(f => f.severity === 'significant').length;

        // Calculate penalty: -30 points per critical, -15 per significant
        const penaltyPoints = (criticalCount * 30) + (significantCount * 15);
        adjustedScore = Math.max(0, overallScore - penaltyPoints);

        // // If critical flags exist, cap at 2-star match (40 points)
        // if (criticalCount > 0) {
        //   adjustedScore = Math.min(adjustedScore, 40);
        // }
      }

      return {
        personalityScore: Math.round(scores.personalityScore),
        valuesScore: Math.round(scores.valuesScore),
        familyScore: Math.round(scores.familyScore),
        financialScore: Math.round(scores.financialScore),
        lifestyleScore: Math.round(scores.lifestyleScore),
        workLifeScore: Math.round(scores.workLifeScore),
        healthScore: Math.round(scores.healthScore),
        physicalScore: Math.round(scores.physicalScore),
        overallCompatibilityScore: Math.round(Math.max(0, adjustedScore)),
        matchRating,
        redFlags,
        incompatibilityReasons,
        raw: scores,
      };
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      throw error;
    }
  }

  /**
   * Get user's MVP questionnaire responses
   * @param {number} userId - User ID
   * @param {string} questionnaireType - Questionnaire type (default: 'MVP Questionnaire')
   * @returns {Promise<Object>} User responses object { Q1: value, Q2: value, ... }
   */
  static async getUserResponses(userId, questionnaireType = 'MVP Questionnaire') {
    const questionnaireResponse = await QuestionnaireResponse.findOne({
      where: { userId },
      include: [
        {
          model: Questionnaire,
          where: { type: 'MVP' },
        },
        {
          model: Answer,
          include: [
            {
              model: Question,
            },
          ],
        },
      ],
    });

    if (!questionnaireResponse) {
      return null;
    }

    // Map answers to question format
    const responses = {};
    questionnaireResponse.Answers.forEach((answer) => {
      // Extract question number from question text or use questionId
      const questionNum = answer.Question.order;
      responses[`Q${questionNum}`] = answer.value;
    });

    return responses;
  }

  /**
   * Calculate personality compatibility (Big Five)
   * Questions: Q1-Q10
   * Scoring: Average difference across 5 traits
   */
  static calculatePersonalityScore(user1Responses, user2Responses) {
    const traits = [
      { q1: 'Q1', q2: 'Q2' }, // Openness
      { q1: 'Q3', q2: 'Q4' }, // Conscientiousness
      { q1: 'Q5', q2: 'Q6' }, // Extraversion
      { q1: 'Q7', q2: 'Q8' }, // Agreeableness
      { q1: 'Q9', q2: 'Q10' }, // Neuroticism
    ];

    let totalCompatibility = 0;

    traits.forEach((trait) => {
      // Get responses, handle reverse scoring
      const user1Score1 = parseInt(user1Responses[trait.q1]) || 3;
      const user1Score2 = this.reverseScore(parseInt(user1Responses[trait.q2]) || 3);
      const user1TraitScore = (user1Score1 + user1Score2) / 2;

      const user2Score1 = parseInt(user2Responses[trait.q1]) || 3;
      const user2Score2 = this.reverseScore(parseInt(user2Responses[trait.q2]) || 3);
      const user2TraitScore = (user2Score1 + user2Score2) / 2;

      // Calculate compatibility (similarity is preferred, but some complementarity okay)
      const difference = Math.abs(user1TraitScore - user2TraitScore);
      const traitCompatibility = 100 - (difference / 5) * 50; // Max 2.5 point diff = 50% penalty

      totalCompatibility += traitCompatibility;
    });

    return totalCompatibility / traits.length;
  }

  /**
   * Calculate core values compatibility
   * Questions: Q11-Q18
   * Scoring: Overlap in top values, individual vs collective alignment
   */
  static calculateValuesScore(user1Responses, user2Responses) {
    let score = 50; // Start at 50

    // Q11-Q12: Top 2 values (hard to score, assume baseline)
    // Q13: Individual vs Collective (1-10 scale)
    const user1Collective = parseInt(user1Responses.Q13) || 5;
    const user2Collective = parseInt(user2Responses.Q13) || 5;
    const collectiveDiff = Math.abs(user1Collective - user2Collective);
    const collectiveScore = 100 - (collectiveDiff / 10) * 50;
    score += collectiveScore * 0.4; // 40% weight to this dimension

    // Q14: Tradition vs Innovation (1-10 scale)
    const user1Tradition = parseInt(user1Responses.Q14) || 5;
    const user2Tradition = parseInt(user2Responses.Q14) || 5;
    const traditionDiff = Math.abs(user1Tradition - user2Tradition);
    const traditionScore = 100 - (traditionDiff / 10) * 50;
    score += traditionScore * 0.3; // 30% weight

    // Q15: Achievement vs Relational (1-3 scale, treat as 1-5)
    const user1Achievement = this.mapChoiceToScore(user1Responses.Q15, 1.5, 3);
    const user2Achievement = this.mapChoiceToScore(user2Responses.Q15, 1.5, 3);
    const achievementDiff = Math.abs(user1Achievement - user2Achievement);
    const achievementScore = 100 - (achievementDiff / 4) * 50;
    score += achievementScore * 0.2; // 20% weight

    // Q16-Q17: Life purpose (hard to score exactly)
    // Q18: Self-transcendence (1-5 scale)
    const user1Transcendence = parseInt(user1Responses.Q18) || 3;
    const user2Transcendence = parseInt(user2Responses.Q18) || 3;
    const transcendenceDiff = Math.abs(user1Transcendence - user2Transcendence);
    const transcendenceScore = 100 - (transcendenceDiff / 5) * 50;
    score += transcendenceScore * 0.1; // 10% weight

    return Math.min(100, Math.max(0, score / 2)); // Normalize
  }

  /**
   * Calculate family planning compatibility
   * Questions: Q19-Q23 (CRITICAL)
   * Scoring: Children alignment, monogamy alignment
   */
  static calculateFamilyScore(user1Responses, user2Responses) {
    let score = 50;

    // Q19: Children desired (CRITICAL)
    // Options: yes, probably, uncertain, probably not, no
    const childrenValue = {
      'definitely yes': 5,
      'definitely yes, it\'s important to me': 5,
      'probably yes': 4,
      'probably yes, open to it': 4,
      'uncertain': 3,
      'uncertain, would decide with partner': 3,
      'probably no': 2,
      'probably no, leaning toward not having': 2,
      'definitely no': 1,
      'definitely no, i don\'t want children': 1,
    };

    const user1Children = childrenValue[user1Responses.Q19?.toLowerCase()] || 3;
    const user2Children = childrenValue[user2Responses.Q19?.toLowerCase()] || 3;
    const childrenDiff = Math.abs(user1Children - user2Children);
    const childrenScore =
      childrenDiff === 0
        ? 100
        : childrenDiff === 1
          ? 75
          : childrenDiff === 2
            ? 40
            : childrenDiff === 3
              ? 20
              : 10;
    score += childrenScore * 0.5; // 50% weight to children desire

    // Q22: Commitment level (CRITICAL)
    const commitmentValue = {
      'long-term partnership or marriage': 5,
      'long-term partnership': 5,
      'committed long-term relationship': 4,
      'long-term relationship': 3,
      'short-term dating': 2,
      'open to whatever': 1,
    };
    const user1Commitment =
      commitmentValue[user1Responses.Q22?.toLowerCase()] || 3;
    const user2Commitment =
      commitmentValue[user2Responses.Q22?.toLowerCase()] || 3;
    const commitmentDiff = Math.abs(user1Commitment - user2Commitment);
    const commitmentScore =
      commitmentDiff <= 1
        ? 100
        : commitmentDiff === 2
          ? 50
          : commitmentDiff === 3
            ? 30
            : 10;
    score += commitmentScore * 0.3; // 30% weight

    // Q23: Monogamy preference (CRITICAL)
    const monogamyValue = {
      'monogamous': 3,
      'monogamous (exclusive romantic relationship)': 3,
      'open to discussion': 2,
      'open to discussion/flexible': 2,
      'open relationship': 1,
      'open relationship (consensual non-monogamy)': 1,
    };
    const user1Monogamy = monogamyValue[user1Responses.Q23?.toLowerCase()] || 2;
    const user2Monogamy = monogamyValue[user2Responses.Q23?.toLowerCase()] || 2;
    const monogamyDiff = Math.abs(user1Monogamy - user2Monogamy);
    const monogamyScore =
      monogamyDiff === 0 ? 100 : monogamyDiff === 1 ? 50 : 10;
    score += monogamyScore * 0.2; // 20% weight

    return Math.min(100, Math.max(0, score / 2));
  }

  /**
   * Calculate financial attitudes compatibility
   * Questions: Q24-Q29
   * Scoring: Spending vs saving alignment, transparency preference
   */
  static calculateFinancialScore(user1Responses, user2Responses) {
    let score = 50;

    // Q24: Spending vs Saving (1-10 scale)
    const user1Spending = parseInt(user1Responses.Q24) || 5;
    const user2Spending = parseInt(user2Responses.Q24) || 5;
    const spendingDiff = Math.abs(user1Spending - user2Spending);
    const spendingScore =
      spendingDiff <= 2
        ? 100
        : spendingDiff <= 4
          ? 75
          : spendingDiff <= 6
            ? 40
            : 10;
    score += spendingScore * 0.35; // 35% weight (high importance)

    // Q25: Financial Transparency
    const transparencyValue = {
      'complete openness': 4,
      'complete openness (combine finances, full visibility)': 4,
      'mostly transparent': 3,
      'mostly transparent (shared account + personal money)': 3,
      'partially separate': 2,
      'partially separate (separate accounts, split shared expenses)': 2,
      'completely separate': 1,
      'completely separate (minimal financial overlap)': 1,
    };
    const user1Transparency = transparencyValue[user1Responses.Q25?.toLowerCase()] || 2;
    const user2Transparency = transparencyValue[user2Responses.Q25?.toLowerCase()] || 2;
    const transparencyDiff = Math.abs(user1Transparency - user2Transparency);
    const transparencyScore =
      transparencyDiff === 0 ? 100 : transparencyDiff === 1 ? 75 : 40;
    score += transparencyScore * 0.35; // 35% weight

    // Q26: Debt Comfort Level (1-10 scale)
    const user1Debt = parseInt(user1Responses.Q26) || 5;
    const user2Debt = parseInt(user2Responses.Q26) || 5;
    const debtDiff = Math.abs(user1Debt - user2Debt);
    const debtScore = 100 - (debtDiff / 10) * 50;
    score += debtScore * 0.15; // 15% weight

    // Q28: Financial Priority (1-10 scale)
    const user1Priority = parseInt(user1Responses.Q28) || 5;
    const user2Priority = parseInt(user2Responses.Q28) || 5;
    const priorityDiff = Math.abs(user1Priority - user2Priority);
    const priorityScore = 100 - (priorityDiff / 10) * 40;
    score += priorityScore * 0.15; // 15% weight

    return Math.min(100, Math.max(0, score / 2));
  }

  /**
   * Calculate lifestyle preferences compatibility
   * Questions: Q30-Q37
   * Scoring: Sleep schedule, exercise, social frequency, cleanliness
   */
  static calculateLifestyleScore(user1Responses, user2Responses) {
    let score = 50;

    // Q30-Q31: Sleep schedule (IMPORTANT for daily life)
    const wakeMap = { 'very early (5-6 am)': 5.5, 'early (6-7 am)': 6.5, 'regular (7-8 am)': 7.5, 'late (8-9 am)': 8.5, 'very late (9+ am)': 9.5 };
    const sleepMap = { 'very early (9-10 pm)': 9.5, 'early (10-11 pm)': 10.5, 'regular (11 pm-12 am)': 11.5, 'late (12-1 am)': 0.5, 'very late (1+ am)': 1.5 };

    const user1WakeHour = wakeMap[user1Responses.Q30?.toLowerCase()] || 7.5;
    const user2WakeHour = wakeMap[user2Responses.Q30?.toLowerCase()] || 7.5;
    const wakeDiff = Math.abs(user1WakeHour - user2WakeHour);
    const wakeScore = 100 - (wakeDiff / 2) * 25;

    const user1SleepHour = sleepMap[user1Responses.Q31?.toLowerCase()] || 11.5;
    const user2SleepHour = sleepMap[user2Responses.Q31?.toLowerCase()] || 11.5;
    let sleepDiff = Math.abs(user1SleepHour - user2SleepHour);
    if (sleepDiff > 12) sleepDiff = 24 - sleepDiff; // Handle wrap-around
    const sleepScore = 100 - (sleepDiff / 2) * 25;

    const sleepCompatibility = (wakeScore + sleepScore) / 2;
    score += sleepCompatibility * 0.35; // 35% weight (critical for daily life)

    // Q32: Exercise frequency
    const exerciseMap = {
      'rarely or never': 1,
      '1-2 times per week': 2,
      '3-4 times per week': 3,
      '5+ times per week': 4,
      'depends on season': 2.5,
    };
    const user1Exercise = exerciseMap[user1Responses.Q32?.toLowerCase()] || 2;
    const user2Exercise = exerciseMap[user2Responses.Q32?.toLowerCase()] || 2;
    const exerciseDiff = Math.abs(user1Exercise - user2Exercise);
    const exerciseScore = 100 - (exerciseDiff / 4) * 40;
    score += exerciseScore * 0.15; // 15% weight

    // Q33: Social frequency
    const socialMap = {
      'multiple times per week': 4,
      'once or twice per week': 3,
      'a few times per month': 2,
      'monthly or less': 1,
      'varies greatly': 2.5,
    };
    const user1Social = socialMap[user1Responses.Q33?.toLowerCase()] || 2;
    const user2Social = socialMap[user2Responses.Q33?.toLowerCase()] || 2;
    const socialDiff = Math.abs(user1Social - user2Social);
    const socialScore = 100 - (socialDiff / 4) * 50;
    score += socialScore * 0.15; // 15% weight

    // Q35: Cleanliness standards (IMPORTANT source of conflict)
    const user1Cleanliness = parseInt(user1Responses.Q35) || 5;
    const user2Cleanliness = parseInt(user2Responses.Q35) || 5;
    const cleanDiff = Math.abs(user1Cleanliness - user2Cleanliness);
    const cleanScore =
      cleanDiff <= 2
        ? 100
        : cleanDiff <= 4
          ? 75
          : cleanDiff <= 6
            ? 40
            : 10;
    score += cleanScore * 0.2; // 20% weight (important for household harmony)

    return Math.min(100, Math.max(0, score / 2.1));
  }

  /**
   * Calculate work-life balance compatibility
   * Questions: Q38-Q42
   */
  static calculateWorkLifeScore(user1Responses, user2Responses) {
    let score = 50;

    // Q38: Career Priority (1-10 scale, inverted so higher = less career focus)
    const user1Career = parseInt(user1Responses.Q38) || 5;
    const user2Career = parseInt(user2Responses.Q38) || 5;
    const careerDiff = Math.abs(user1Career - user2Career);
    const careerScore = 100 - (careerDiff / 10) * 40;
    score += careerScore * 0.4; // 40% weight

    // Q39: Desired work hours
    const hoursMap = {
      '20-30 hours (part-time emphasis)': 25,
      '30-40 hours (standard full-time)': 35,
      '40-50 hours (full-time with career focus)': 45,
      '50-60 hours (significant career focus)': 55,
      '60+ hours (very high career intensity)': 70,
    };
    const user1Hours = hoursMap[user1Responses.Q39?.toLowerCase()] || 40;
    const user2Hours = hoursMap[user2Responses.Q39?.toLowerCase()] || 40;
    const hoursDiff = Math.abs(user1Hours - user2Hours);
    const hoursScore = 100 - (hoursDiff / 50) * 50;
    score += hoursScore * 0.4; // 40% weight

    // Q42: Partner's career support (1-10 scale)
    const user1Support = parseInt(user1Responses.Q42) || 5;
    const user2Support = parseInt(user2Responses.Q42) || 5;
    const supportDiff = Math.abs(user1Support - user2Support);
    const supportScore = 100 - (supportDiff / 10) * 40;
    score += supportScore * 0.2; // 20% weight

    return Math.min(100, Math.max(0, score / 2));
  }

  /**
   * Calculate health & wellness compatibility
   * Questions: Q43-Q46
   */
  static calculateHealthScore(user1Responses, user2Responses) {
    let score = 50;

    // Q43: Health consciousness (1-10 scale)
    const user1Health = parseInt(user1Responses.Q43) || 5;
    const user2Health = parseInt(user2Responses.Q43) || 5;
    const healthDiff = Math.abs(user1Health - user2Health);
    const healthScore = 100 - (healthDiff / 10) * 50;
    score += healthScore * 0.35; // 35% weight

    // Q44-Q45: Substance use alignment
    const substanceMap = {
      'never or rarely drink': 1,
      'never or rarely': 1,
      'social drinker': 2,
      'regular drinker': 3,
      'heavy drinker': 4,
    };
    const user1Alcohol = substanceMap[user1Responses.Q44?.toLowerCase()] || 1;
    const user2Alcohol = substanceMap[user2Responses.Q44?.toLowerCase()] || 1;
    const alcoholDiff = Math.abs(user1Alcohol - user2Alcohol);
    const alcoholScore =
      alcoholDiff === 0
        ? 100
        : alcoholDiff === 1
          ? 75
          : alcoholDiff === 2
            ? 50
            : 20;

    const tobaccoMap = {
      'never used': 1,
      'quit but used to': 2,
      'occasional use': 3,
      'regular use': 4,
    };
    const user1Tobacco = tobaccoMap[user1Responses.Q45?.toLowerCase()] || 1;
    const user2Tobacco = tobaccoMap[user2Responses.Q45?.toLowerCase()] || 1;
    const tobaccoDiff = Math.abs(user1Tobacco - user2Tobacco);
    const tobaccoScore =
      tobaccoDiff === 0
        ? 100
        : tobaccoDiff === 1
          ? 75
          : tobaccoDiff === 2
            ? 50
            : 20;

    const substanceScore = (alcoholScore + tobaccoScore) / 2;
    score += substanceScore * 0.4; // 40% weight

    // Q46: Mental health attitudes
    const mentalHealthMap = {
      'see it as important': 4,
      'open to it': 3,
      'skeptical': 2,
      'don\'t believe': 1,
    };
    const user1Mental = mentalHealthMap[user1Responses.Q46?.toLowerCase()] || 3;
    const user2Mental = mentalHealthMap[user2Responses.Q46?.toLowerCase()] || 3;
    const mentalDiff = Math.abs(user1Mental - user2Mental);
    const mentalScore = 100 - (mentalDiff / 4) * 50;
    score += mentalScore * 0.25; // 25% weight

    return Math.min(100, Math.max(0, score / 2));
  }

  /**
   * Calculate physical preference compatibility
   * Questions: Q47-Q50
   */
  static calculatePhysicalScore(user1Responses, user2Responses) {
    // This is simplified - would need actual age/physical data
    let score = 75; // Baseline - assumes mutual matching happened

    // Q47: Age range check
    // Would extract age preferences and check if users fall within each other's range
    // For MVP, assume pre-filtered by age

    // Q48: Physical attractiveness importance alignment
    const user1PhysicalImportance = parseInt(user1Responses.Q48) || 5;
    const user2PhysicalImportance = parseInt(user2Responses.Q48) || 5;
    const importanceDiff = Math.abs(user1PhysicalImportance - user2PhysicalImportance);
    const importanceScore = 100 - (importanceDiff / 10) * 30;
    score = (score + importanceScore) / 2;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calculate overall weighted compatibility score
   * All weights must sum to 1.0 for accurate scoring
   */
  static calculateOverallScore(scores) {
    const weights = {
      personalityScore: 0.25,      // 25%
      valuesScore: 0.30,           // 30%
      familyScore: 0.25,           // 25%
      financialScore: 0.13,        // 13% (reduced from 20% to make room for adjustments)
      lifestyleScore: 0.04,        // 4% (increased from 2.5%)
      workLifeScore: 0.02,         // 2% (increased from 2.5%)
      healthScore: 0.01,           // 1% (increased from 1.25%)
    };
    // Note: physicalScore not included in overall calculation as it requires
    // actual age/location validation that happens at user filtering stage

    // Verify weights sum to 1.0 (for debugging)
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (Math.abs(totalWeight - 1.0) > 0.001) {
      console.warn(`Warning: Compatibility weights sum to ${totalWeight}, not 1.0`);
    }

    let overallScore = 0;
    for (const [key, weight] of Object.entries(weights)) {
      overallScore += (scores[key] || 0) * weight;
    }

    return Math.min(100, Math.max(0, overallScore));
  }

  /**
   * Check for critical incompatibilities (red flags)
   */
  static checkRedFlags(user1Responses, user2Responses) {
    const redFlags = [];
    const incompatibilityReasons = {};

    // Check children mismatch (CRITICAL)
    const childrenValue = {
      'definitely yes': 'yes',
      'definitely yes, it\'s important to me': 'yes',
      'probably yes': 'yes',
      'probably yes, open to it': 'yes',
      'uncertain': 'uncertain',
      'uncertain, would decide with partner': 'uncertain',
      'probably no': 'no',
      'probably no, leaning toward not having': 'no',
      'definitely no': 'no',
      'definitely no, i don\'t want children': 'no',
    };

    const user1Children = childrenValue[user1Responses.Q19?.toLowerCase()] || 'uncertain';
    const user2Children = childrenValue[user2Responses.Q19?.toLowerCase()] || 'uncertain';

    if (
      (user1Children === 'yes' && user2Children === 'no') ||
      (user1Children === 'no' && user2Children === 'yes')
    ) {
      redFlags.push({
        flag: 'Family Planning Incompatibility',
        severity: 'critical',
        description: 'One partner wants children, the other does not',
      });
      incompatibilityReasons.family = 'Fundamental disagreement on children';
    }

    // Check monogamy mismatch (CRITICAL)
    const monogamyMap = {
      'monogamous': 'monogamous',
      'monogamous (exclusive romantic relationship)': 'monogamous',
      'open to discussion': 'flexible',
      'open to discussion/flexible': 'flexible',
      'open relationship': 'non-monogamous',
      'open relationship (consensual non-monogamy)': 'non-monogamous',
    };

    const user1Monogamy = monogamyMap[user1Responses.Q23?.toLowerCase()] || 'flexible';
    const user2Monogamy = monogamyMap[user2Responses.Q23?.toLowerCase()] || 'flexible';

    if (
      (user1Monogamy === 'monogamous' && user2Monogamy === 'non-monogamous') ||
      (user1Monogamy === 'non-monogamous' && user2Monogamy === 'monogamous')
    ) {
      redFlags.push({
        flag: 'Relationship Structure Incompatibility',
        severity: 'critical',
        description: 'Fundamental disagreement on relationship exclusivity',
      });
      incompatibilityReasons.relationship = 'Monogamy preferences incompatible';
    }

    // Check extreme spending mismatch (SIGNIFICANT)
    const user1Spending = parseInt(user1Responses.Q24) || 5;
    const user2Spending = parseInt(user2Responses.Q24) || 5;
    if (Math.abs(user1Spending - user2Spending) >= 7) {
      redFlags.push({
        flag: 'Financial Attitude Conflict',
        severity: 'significant',
        description: 'Extreme difference in spending vs. saving orientation',
      });
      incompatibilityReasons.financial = 'Severe spending-saving mismatch';
    }

    // Check extreme cleanliness mismatch (SIGNIFICANT)
    const user1Clean = parseInt(user1Responses.Q35) || 5;
    const user2Clean = parseInt(user2Responses.Q35) || 5;
    if (Math.abs(user1Clean - user2Clean) >= 7) {
      redFlags.push({
        flag: 'Household Standards Conflict',
        severity: 'significant',
        description: 'Major difference in cleanliness and organization standards',
      });
      incompatibilityReasons.lifestyle = 'Severe household standards mismatch';
    }

    // Check extreme extraversion mismatch (CAUTION)
    const user1Social = [5, 6].includes(parseInt(user1Responses.Q5)) ? 'high' :
      [1, 2].includes(parseInt(user1Responses.Q6)) ? 'high' : 'low';
    const user2Social = [5, 6].includes(parseInt(user2Responses.Q5)) ? 'high' :
      [1, 2].includes(parseInt(user2Responses.Q6)) ? 'high' : 'low';

    if (
      (user1Social === 'high' && user2Social === 'low') ||
      (user1Social === 'low' && user2Social === 'high')
    ) {
      // Not a red flag, but noted as caution
    }

    return { redFlags, incompatibilityReasons };
  }

  /**
   * Calculate match rating based on score and red flags
   */
  static calculateMatchRating(score, redFlags) {
    if (redFlags.length > 0) {
      return 1; // 1 star if any critical flags
    }

    if (score >= 85) return 5;
    if (score >= 70) return 4;
    if (score >= 50) return 3;
    if (score >= 35) return 2;
    return 1;
  }

  /**
   * Helper: Reverse score for inverse questions
   */
  static reverseScore(score) {
    return 6 - score; // 1→5, 2→4, 3→3, 4→2, 5→1
  }

  /**
   * Helper: Map choice responses to numerical scores
   */
  static mapChoiceToScore(choice, lowValue, highValue) {
    if (!choice) return (lowValue + highValue) / 2;
    const choiceLower = choice.toLowerCase();
    if (choiceLower.includes('career') || choiceLower.includes('achievement')) {
      return highValue;
    }
    if (choiceLower.includes('relationship') || choiceLower.includes('connection')) {
      return lowValue;
    }
    if (choiceLower.includes('balanced')) {
      return (lowValue + highValue) / 2;
    }
    return (lowValue + highValue) / 2;
  }

  /**
   * Save compatibility score to database
   */
  static async saveScore(userId1, userId2, scoreData) {
    try {
      const score = await MVPQuestionnaireScore.create({
        userId1,
        userId2,
        personalityScore: scoreData.personalityScore,
        valuesScore: scoreData.valuesScore,
        familyScore: scoreData.familyScore,
        financialScore: scoreData.financialScore,
        lifestyleScore: scoreData.lifestyleScore,
        workLifeScore: scoreData.workLifeScore,
        healthScore: scoreData.healthScore,
        physicalScore: scoreData.physicalScore,
        overallCompatibilityScore: scoreData.overallCompatibilityScore,
        matchRating: scoreData.matchRating,
        redFlags: scoreData.redFlags,
        incompatibilityReasons: scoreData.incompatibilityReasons,
      });
      return score;
    } catch (error) {
      console.error('Error saving compatibility score:', error);
      throw error;
    }
  }
}

module.exports = MVPQuestionnaireScorer;
