// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const models = require('./db/models');
const routes = require('./routes');
const { getQuestionnaireTemplates } = require('./data/questionnaire-templates');

const app = express();
const PORT = process.env.PORT || 3001;

// ==============================
// Middleware
// ==============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Seed questionnaire templates
// ==============================
// Runs on startup to ensure templates exist and stay in sync
async function seedQuestionnaireTemplates() {
  const templates = getQuestionnaireTemplates();

  for (const template of templates) {
    // Find or create questionnaire by type
    const [questionnaire, created] = await models.Questionnaire.findOrCreate({
      where: { type: template.type },
      defaults: {
        title: template.title,
        description: template.description,
        category: template.category,
        version: 1,
        isActive: true,
      },
    });

    if (created) {
      console.log(`  ✓ Created ${template.type} questionnaire (ID: ${questionnaire.id})`);
    }

    // Upsert questions by (questionnaireId, order)
    let upserted = 0;

    for (const q of template.questions) {
      const [question, qCreated] = await models.Question.findOrCreate({
        where: { questionnaireId: questionnaire.id, order: q.order },
        defaults: {
          text: q.text,
          type: q.type,
          options: q.options,
          required: q.required,
          section: q.section,
          sectionDescription: q.sectionDescription,
          reversed: q.reversed,
          critical: q.critical,
          conditional: q.conditional,
        },
      });

      if (!qCreated) {
        // Update existing question with latest template data
        await question.update({
          text: q.text,
          type: q.type,
          options: q.options,
          required: q.required,
          section: q.section,
          sectionDescription: q.sectionDescription,
          reversed: q.reversed,
          critical: q.critical,
          conditional: q.conditional,
        });
      }

      upserted++;
    }

    console.log(`  ✓ ${template.type}: ${upserted} questions synced`);
  }

  console.log('✅ Questionnaire templates seeded');
}

// ==============================
// Routes
// ==============================
// Mount API + frontend routes
app.use(routes);

// ==============================
// Error handling middleware
// ==============================
// Catch server errors and hide stack traces in production
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==============================
// 404 handler
// ==============================
// Handles unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==============================
// Server startup with DB init
// ==============================
// Ensures DB is ready before server starts
async function startServer() {
  try {
    // Test DB connection
    await models.sequelize.authenticate();
    console.log('✓ Database connection successful');

    // SQLite-specific setup (development only)
    if (process.env.NODE_ENV === 'development') {
      // Enable foreign key constraints for SQLite
      await models.sequelize.query('PRAGMA foreign_keys = ON');
      console.log('✓ SQLite foreign keys enabled');

      // Sync schema ONLY in development
      console.log('\n🔄 Initializing database...');
      console.log('📋 Creating database schema...');
      await models.sequelize.sync({ force: false, alter: false });
      console.log('✅ Database schema created');
    }

    // Seed templates (safe in both dev + production)
    await seedQuestionnaireTemplates();
    console.log('✅ Database initialization complete\n');

    // Start server AFTER DB is ready
    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at /api`);
    // prevent crashes from EADDRINUSE - if backend already running
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
      } else {
        throw err;
      }
    });

  } catch (err) {
    // Fail fast if DB is broken
    console.error('✗ Database error:', err.message);
    process.exit(1);
  }
}

// Start the app
startServer();


module.exports = app;
