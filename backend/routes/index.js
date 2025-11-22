const express = require('express');
const router = express.Router();

const usersRoutes = require('./users');
const questionnairesRoutes = require('./questionnaires');
const preferencesRoutes = require('./preferences');
const likesRoutes = require('./likes');

// API routes
router.use('/users', usersRoutes);
router.use('/questionnaires', questionnairesRoutes);
router.use('/preferences', preferencesRoutes);
router.use('/likes', likesRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

module.exports = router;
