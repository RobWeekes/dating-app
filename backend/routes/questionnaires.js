const express = require('express');
const router = express.Router();
const { Questionnaire, Answer } = require('../models');

// GET all questionnaires
router.get('/', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll({
      include: [{ model: Answer }]
    });
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET questionnaire by ID
router.get('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id, {
      include: [{ model: Answer }]
    });

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET questionnaire by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne({
      where: { userId: req.params.userId },
      include: [{ model: Answer }]
    });

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found for this user' });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new questionnaire
router.post('/', async (req, res) => {
  try {
    const { userId, personalityType, interests, datingGoal, relationshipType, responses } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Check if questionnaire already exists for this user
    const existingQuestionnaire = await Questionnaire.findOne({ where: { userId } });
    if (existingQuestionnaire) {
      return res.status(409).json({ error: 'Questionnaire already exists for this user' });
    }

    const questionnaire = await Questionnaire.create({
      userId,
      personalityType,
      interests,
      datingGoal,
      relationshipType,
      responses
    });

    res.status(201).json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE questionnaire by ID
router.put('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    const { personalityType, interests, datingGoal, relationshipType, responses } = req.body;

    await questionnaire.update({
      personalityType: personalityType || questionnaire.personalityType,
      interests: interests || questionnaire.interests,
      datingGoal: datingGoal || questionnaire.datingGoal,
      relationshipType: relationshipType || questionnaire.relationshipType,
      responses: responses || questionnaire.responses
    });

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE questionnaire by ID
router.delete('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    await questionnaire.destroy();
    res.json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE answer for a questionnaire
router.post('/:id/answers', async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId) {
      return res.status(400).json({ error: 'Question ID is required' });
    }

    const questionnaire = await Questionnaire.findByPk(req.params.id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    const newAnswer = await Answer.create({
      questionnaireId: req.params.id,
      questionId,
      answer
    });

    res.status(201).json(newAnswer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// COMPATIBILITY QUESTIONNAIRE ENDPOINTS

// POST - Submit compatibility questionnaire response
router.post('/compatibility', async (req, res) => {
  try {
    const { userId, type, relationshipType, responses, completedAt, length } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!relationshipType) {
      return res.status(400).json({ error: 'Relationship type is required' });
    }

    // For now, store in a simple JSON response
    // In production, create a dedicated CompatibilityQuestionnaire model
    const compatibilityResponse = {
      userId,
      type,
      relationshipType,
      responses,
      completedAt: completedAt || new Date().toISOString(),
      length,
    };

    // Store in questionnaire responses (temporary solution)
    // This should be in a separate table in production
    const questionnaire = await Questionnaire.create({
      userId,
      personalityType: null,
      datingGoal: relationshipType === 'CASUAL' ? 'Casual dating' : 'Long-term relationship',
      relationshipType: relationshipType,
      responses: compatibilityResponse,
      interests: []
    });

    res.status(201).json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Retrieve compatibility questionnaire response for a user
router.get('/compatibility/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find questionnaire with compatibility responses
    const questionnaire = await Questionnaire.findOne({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    if (!questionnaire) {
      return res.status(404).json({ error: 'No questionnaire found for this user' });
    }

    // Filter by type if specified
    if (type && questionnaire.responses?.relationshipType !== type) {
      return res.status(404).json({ error: `No ${type} questionnaire found for this user` });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
