const express = require('express');
const router = express.Router();
const { User, QuestionnaireResponse, Answer, Question, MVPQuestionnaireScore } = require('../models');
const MVPQuestionnaireScorer = require('../services/MVPQuestionnaireScorer');
const { authenticateToken } = require('../middleware/authentication');

/**
 * MVP QUESTIONNAIRE SCORING ROUTES
 * Calculate and retrieve compatibility scores between users
 */

/**
 * POST /api/mvp-scoring/calculate
 * Calculate compatibility score between two users
 * Requires: userId1, userId2
 */
router.post('/calculate', authenticateToken, async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    if (!userId1 || !userId2) {
      return res.status(400).json({ error: 'userId1 and userId2 are required' });
    }

    if (userId1 === userId2) {
      return res.status(400).json({ error: 'Cannot calculate compatibility with same user' });
    }

    // Verify both users exist
    const user1 = await User.findByPk(userId1);
    const user2 = await User.findByPk(userId2);

    if (!user1 || !user2) {
      return res.status(404).json({ error: 'One or both users not found' });
    }

    // Calculate compatibility
    const scoreData = await MVPQuestionnaireScorer.calculateCompatibility(userId1, userId2);

    // Check if score already exists in database
    let savedScore = await MVPQuestionnaireScore.findOne({
      where: {
        userId1,
        userId2,
      },
    });

    // Create or update the score
    if (savedScore) {
      savedScore = await savedScore.update({
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
    } else {
      savedScore = await MVPQuestionnaireScore.create({
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
    }

    res.json({
      success: true,
      compatibility: scoreData,
      saved: true,
      scoreId: savedScore.id,
    });
  } catch (error) {
    console.error('Error calculating compatibility:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/mvp-scoring/score/:userId1/:userId2
 * Get previously calculated compatibility score between two users
 */
router.get('/score/:userId1/:userId2', authenticateToken, async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    // Try both directions (userId1→userId2 and userId2→userId1)
    let score = await MVPQuestionnaireScore.findOne({
      where: { userId1, userId2 },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!score) {
      score = await MVPQuestionnaireScore.findOne({
        where: { userId1: userId2, userId2: userId1 },
        include: [
          {
            model: User,
            as: 'user1',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
          {
            model: User,
            as: 'user2',
            attributes: ['id', 'firstName', 'lastName', 'email'],
          },
        ],
      });
    }

    if (!score) {
      return res.status(404).json({ error: 'Compatibility score not found. Calculate it first.' });
    }

    res.json(score);
  } catch (error) {
    console.error('Error retrieving compatibility score:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/mvp-scoring/matches/:userId
 * Get all compatibility matches for a user
 * Returns: Array of users with their compatibility scores, sorted by score
 */
router.get('/matches/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0, minScore = 35 } = req.query;

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get all compatibility scores for this user
    const scores = await MVPQuestionnaireScore.findAll({
      where: {
        userId1: userId,
        overallCompatibilityScore: { [require('sequelize').Op.gte]: minScore },
      },
      include: [
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'firstName', 'lastName', 'age', 'location', 'bio', 'profilePhotoUrl'],
        },
      ],
      order: [['overallCompatibilityScore', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Also get scores where user is userId2
    const reverseScores = await MVPQuestionnaireScore.findAll({
      where: {
        userId2: userId,
        overallCompatibilityScore: { [require('sequelize').Op.gte]: minScore },
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'firstName', 'lastName', 'age', 'location', 'bio', 'profilePhotoUrl'],
        },
      ],
      order: [['overallCompatibilityScore', 'DESC']],
    });

    // Combine and format results
    const matches = scores.map((score) => ({
      matchUserId: score.user2.id,
      matchUser: score.user2,
      compatibility: {
        overallScore: score.overallCompatibilityScore,
        matchRating: score.matchRating,
        personalityScore: score.personalityScore,
        valuesScore: score.valuesScore,
        familyScore: score.familyScore,
        financialScore: score.financialScore,
        lifestyleScore: score.lifestyleScore,
        workLifeScore: score.workLifeScore,
        healthScore: score.healthScore,
        physicalScore: score.physicalScore,
      },
      redFlags: score.redFlags,
      incompatibilityReasons: score.incompatibilityReasons,
      scoreId: score.id,
    }));

    const reverseMatches = reverseScores.map((score) => ({
      matchUserId: score.user1.id,
      matchUser: score.user1,
      compatibility: {
        overallScore: score.overallCompatibilityScore,
        matchRating: score.matchRating,
        personalityScore: score.personalityScore,
        valuesScore: score.valuesScore,
        familyScore: score.familyScore,
        financialScore: score.financialScore,
        lifestyleScore: score.lifestyleScore,
        workLifeScore: score.workLifeScore,
        healthScore: score.healthScore,
        physicalScore: score.physicalScore,
      },
      redFlags: score.redFlags,
      incompatibilityReasons: score.incompatibilityReasons,
      scoreId: score.id,
    }));

    // Combine and sort by score
    const allMatches = [...matches, ...reverseMatches].sort(
      (a, b) => b.compatibility.overallScore - a.compatibility.overallScore
    );

    // Remove duplicates (if same pair exists both directions)
    const uniqueMatches = [];
    const seenUserIds = new Set();
    allMatches.forEach((match) => {
      if (!seenUserIds.has(match.matchUserId)) {
        uniqueMatches.push(match);
        seenUserIds.add(match.matchUserId);
      }
    });

    res.json({
      userId,
      totalMatches: uniqueMatches.length,
      matches: uniqueMatches.slice(0, limit),
      averageCompatibility:
        uniqueMatches.length > 0
          ? (
              uniqueMatches.reduce((sum, m) => sum + m.compatibility.overallScore, 0) /
              uniqueMatches.length
            ).toFixed(1)
          : 0,
    });
  } catch (error) {
    console.error('Error retrieving matches:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/mvp-scoring/top-matches/:userId
 * Get top N compatibility matches (simplified version)
 */
router.get('/top-matches/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const matches = await MVPQuestionnaireScore.findAll({
      where: {
        userId1: userId,
        overallCompatibilityScore: { [require('sequelize').Op.gte]: 50 },
      },
      attributes: [
        'id',
        'overallCompatibilityScore',
        'matchRating',
        'personalityScore',
        'valuesScore',
        'familyScore',
        'financialScore',
        'redFlags',
      ],
      include: [
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'firstName', 'lastName', 'age', 'location', 'profilePhotoUrl'],
        },
      ],
      order: [['overallCompatibilityScore', 'DESC']],
      limit: parseInt(limit),
    });

    res.json(matches);
  } catch (error) {
    console.error('Error retrieving top matches:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/mvp-scoring/score/:scoreId
 * Delete a stored compatibility score
 */
router.delete('/score/:scoreId', authenticateToken, async (req, res) => {
  try {
    const { scoreId } = req.params;

    const score = await MVPQuestionnaireScore.findByPk(scoreId);
    if (!score) {
      return res.status(404).json({ error: 'Score not found' });
    }

    // Verify user owns this score (is one of the users in the comparison)
    const userId = req.user.id;
    if (score.userId1 !== userId && score.userId2 !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await score.destroy();
    res.json({ success: true, message: 'Score deleted' });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/mvp-scoring/stats/:userId
 * Get compatibility statistics for a user
 */
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all scores for this user
    const scores = await MVPQuestionnaireScore.findAll({
      where: {
        userId1: userId,
      },
      attributes: ['overallCompatibilityScore', 'matchRating'],
    });

    if (scores.length === 0) {
      return res.json({
        userId,
        totalScoresCalculated: 0,
        averageCompatibility: 0,
        matchDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      });
    }

    const avg =
      scores.reduce((sum, s) => sum + s.overallCompatibilityScore, 0) / scores.length;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    scores.forEach((s) => {
      distribution[s.matchRating]++;
    });

    res.json({
      userId,
      totalScoresCalculated: scores.length,
      averageCompatibility: avg.toFixed(1),
      matchDistribution: distribution,
      scoreRange: {
        min: Math.min(...scores.map((s) => s.overallCompatibilityScore)),
        max: Math.max(...scores.map((s) => s.overallCompatibilityScore)),
      },
    });
  } catch (error) {
    console.error('Error retrieving stats:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
