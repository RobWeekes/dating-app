const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const usersRoutes = require('./users');
const questionnairesRoutes = require('./questionnaires');
const preferencesRoutes = require('./preferences');
const likesRoutes = require('./likes');
const mvpScoringRoutes = require('./mvp-scoring');

// API routes
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/questionnaires', questionnairesRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/likes', likesRoutes);
router.use('/mvp-scoring', mvpScoringRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

module.exports = router;
