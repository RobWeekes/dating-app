const express = require('express');
const router = express.Router();
const { Like, User } = require('../models');
const { Op } = require('sequelize');

// GET all likes for a user (who they liked)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const likes = await Like.findAll({
      where: { fromUserId: userId },
      include: [
        { model: User, as: 'toUser', attributes: { exclude: ['password'] } }
      ]
    });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET matches (mutual likes) for a user
router.get('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all users that current user liked
    const userLikes = await Like.findAll({
      where: { fromUserId: userId },
      attributes: ['toUserId']
    });

    const likedUserIds = userLikes.map(like => like.toUserId);

    if (likedUserIds.length === 0) {
      return res.json([]);
    }

    // Find users who liked current user AND current user liked them back
    const matches = await Like.findAll({
      where: {
        fromUserId: { [Op.in]: likedUserIds },
        toUserId: userId
      },
      include: [
        { model: User, as: 'fromUser', attributes: { exclude: ['password'] } }
      ]
    });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE a like
router.post('/', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.body;

    if (!fromUserId || !toUserId) {
      return res.status(400).json({ error: 'fromUserId and toUserId are required' });
    }

    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'Cannot like yourself' });
    }

    // Check if like already exists
    const existingLike = await Like.findOne({
      where: { fromUserId, toUserId }
    });

    if (existingLike) {
      return res.status(409).json({ error: 'You already liked this user' });
    }

    const like = await Like.create({
      fromUserId,
      toUserId
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a like
router.delete('/:fromUserId/:toUserId', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.params;

    const like = await Like.findOne({
      where: { fromUserId, toUserId }
    });

    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await like.destroy();
    res.json({ message: 'Like removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CHECK if user liked another user
router.get('/:fromUserId/:toUserId', async (req, res) => {
  try {
    const { fromUserId, toUserId } = req.params;

    const like = await Like.findOne({
      where: { fromUserId, toUserId }
    });

    res.json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
