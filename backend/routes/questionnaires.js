const express = require('express');
const router = express.Router();
const { Questionnaire, Question, QuestionnaireResponse, Answer, User } = require('../models');
const sequelize = require('../models').sequelize;
const { Op } = require('sequelize');
const { authenticateToken } = require('../middleware/authentication');

/**
 * QUESTIONNAIRE TEMPLATE ROUTES
 * These manage the questionnaire definitions (templates)
 */

// GET all questionnaires (templates)
router.get('/', async (req, res) => {
  try {
    const questionnaires = await Questionnaire.findAll({
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'type', 'options', 'order', 'section', 'sectionDescription', 'reversed', 'critical', 'conditional'],
        },
      ],
      where: { isActive: true },
    });
    res.json(questionnaires);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET questionnaire template by ID
router.get('/:id', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByPk(req.params.id, {
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'type', 'options', 'required', 'order', 'section', 'sectionDescription', 'reversed', 'critical', 'conditional'],
        },
      ],
    });

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET questionnaire template by type
router.get('/type/:type', async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('type')),
        req.params.type.toLowerCase()
      ),
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'type', 'options', 'required', 'order', 'section', 'sectionDescription', 'reversed', 'critical', 'conditional'],
        },
      ],
    });

    if (!questionnaire) {
      return res.status(404).json({ error: `Questionnaire type "${req.params.type}" not found` });
    }

    res.json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * USER QUESTIONNAIRE RESPONSE ROUTES
 * These manage user submissions of questionnaires
 */

// GET authenticated user's response to a questionnaire (must come BEFORE generic :userId route)
router.get('/responses/user/me/questionnaire/:questionnaireId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { questionnaireId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const response = await QuestionnaireResponse.findOne({
      where: { userId, questionnaireId },
      include: [
        {
          model: Answer,
          include: [
            {
              model: Question,
              attributes: ['id', 'text', 'type', 'order'],
            },
          ],
        },
      ],
      order: [[Answer, Question, 'order', 'ASC']],
    });

    if (!response) {
      return res.status(404).json({ error: 'No response found' });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET user's response to a questionnaire by user ID
router.get('/responses/user/:userId/questionnaire/:questionnaireId', async (req, res) => {
  try {
    const { userId, questionnaireId } = req.params;

    const response = await QuestionnaireResponse.findOne({
      where: { userId, questionnaireId },
      include: [
        {
          model: Answer,
          include: [
            {
              model: Question,
              attributes: ['id', 'text', 'type', 'order'],
            },
          ],
        },
      ],
      order: [[Answer, Question, 'order', 'ASC']],
    });

    if (!response) {
      return res.status(404).json({ error: 'No response found for this user and questionnaire' });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all of user's responses
router.get('/responses/user/:userId', async (req, res) => {
  try {
    const responses = await QuestionnaireResponse.findAll({
      where: { userId: req.params.userId },
      include: [
        {
          model: Questionnaire,
          attributes: ['id', 'type', 'title', 'description'],
        },
      ],
      order: [['completedAt', 'DESC']],
    });

    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new questionnaire response (user submits a questionnaire)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, relationshipType, responses, completedAt } = req.body;
    const userId = req.user?.id;

    console.log('POST /questionnaires - req.user:', req.user);
    console.log('userId extracted:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Questionnaire type is required' });
    }

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User verified:', { id: user.id, email: user.email });

    // Find the questionnaire template by type
    console.log(`Looking for questionnaire type: "${type}"`);
    const questionnaire = await Questionnaire.findOne({
      where: { type, isActive: true },
      include: [{ model: Question }],
    });

    console.log('Found questionnaire:', questionnaire ? { id: questionnaire.id, type: questionnaire.type } : null);

    if (!questionnaire) {
      return res.status(404).json({ error: `Questionnaire type "${type}" not found` });
    }

    // Check if user already has a completed response for this questionnaire
    const existingResponse = await QuestionnaireResponse.findOne({
      where: { userId, questionnaireId: questionnaire.id, status: 'completed' },
    });

    if (existingResponse) {
      // Update existing response instead of creating new one
      await existingResponse.update({
        status: 'completed',
        completedAt: new Date(),
      });

      // Delete old answers
      await Answer.destroy({ where: { questionnaireResponseId: existingResponse.id } });

      questionnaireResponse = existingResponse;
    } else {
      // Create new response record
      console.log(`Creating new QuestionnaireResponse: userId=${userId}, questionnaireId=${questionnaire.id}`);
      var questionnaireResponse = await QuestionnaireResponse.create({
        userId,
        questionnaireId: questionnaire.id,
        status: 'completed',
        completedAt: new Date(),
      });
      console.log(`Created QuestionnaireResponse ID: ${questionnaireResponse.id}`);
    }

    // Create answer records for each question
    // All frontends must send numeric questionIds as keys
    if (responses && typeof responses === 'object') {
      const answerPromises = Object.entries(responses).map(([questionId, value]) => {
        const id = parseInt(questionId);
        if (isNaN(id)) {
          console.warn(`Warning: Non-numeric question key "${questionId}" — skipping`);
          return null;
        }

        return Answer.create({
          questionnaireResponseId: questionnaireResponse.id,
          questionId: id,
          value: typeof value === 'string' ? value : JSON.stringify(value),
        });
      }).filter(p => p !== null);

      await Promise.all(answerPromises);
    }

    // Fetch the complete response with answers
    const completeResponse = await QuestionnaireResponse.findByPk(questionnaireResponse.id, {
      include: [
        {
          model: Answer,
          include: [
            {
              model: Question,
              attributes: ['id', 'text', 'type', 'order'],
            },
          ],
        },
        {
          model: Questionnaire,
          attributes: ['id', 'type', 'title'],
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Questionnaire submitted successfully',
      data: completeResponse,
    });
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message, details: error.sql });
  }
});

// UPDATE questionnaire response
router.put('/:responseId', async (req, res) => {
  try {
    const response = await QuestionnaireResponse.findByPk(req.params.responseId);

    if (!response) {
      return res.status(404).json({ error: 'Questionnaire response not found' });
    }

    const { status, completedAt } = req.body;

    await response.update({
      status: status || response.status,
      completedAt: completedAt || response.completedAt,
    });

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE questionnaire response
router.delete('/:responseId', async (req, res) => {
  try {
    const response = await QuestionnaireResponse.findByPk(req.params.responseId);

    if (!response) {
      return res.status(404).json({ error: 'Questionnaire response not found' });
    }

    await response.destroy();
    res.json({ message: 'Questionnaire response deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ANSWER ROUTES
 */

// GET answers for a response
router.get('/:responseId/answers', async (req, res) => {
  try {
    const answers = await Answer.findAll({
      where: { questionnaireResponseId: req.params.responseId },
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'type', 'options'],
        },
      ],
      order: [[Question, 'order', 'ASC']],
    });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE answer for a response
router.post('/:responseId/answers', async (req, res) => {
  try {
    const { questionId, value } = req.body;

    if (!questionId) {
      return res.status(400).json({ error: 'Question ID is required' });
    }

    const response = await QuestionnaireResponse.findByPk(req.params.responseId);
    if (!response) {
      return res.status(404).json({ error: 'Questionnaire response not found' });
    }

    const answer = await Answer.create({
      questionnaireResponseId: req.params.responseId,
      questionId,
      value: typeof value === 'string' ? value : JSON.stringify(value),
    });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE answer
router.put('/answers/:answerId', async (req, res) => {
  try {
    const { value } = req.body;

    const answer = await Answer.findByPk(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    await answer.update({
      value: typeof value === 'string' ? value : JSON.stringify(value),
    });

    res.json(answer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE answer
router.delete('/answers/:answerId', async (req, res) => {
  try {
    const answer = await Answer.findByPk(req.params.answerId);

    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }

    await answer.destroy();
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
