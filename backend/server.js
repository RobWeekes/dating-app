require('dotenv').config();
const express = require('express');
const cors = require('cors');
const models = require('./models');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
models.sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connection successful');
    // Sync models with database (create tables if they don't exist)
    return models.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✓ Database models synced');
  })
  .catch((err) => {
    console.error('✗ Database connection failed:', err);
  });

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ API available at http://localhost:${PORT}/api`);
});

module.exports = app;
