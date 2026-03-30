require('dotenv').config();
const express = require('express');
const cors = require('cors');
const models = require('./db/models');
const routes = require('./routes');
const { getQuestionnaireTemplates } = require('./data/questionnaire-templates');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and initialization
models.sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connection successful');
    // Enable foreign keys for SQLite
    return models.sequelize.query('PRAGMA foreign_keys = ON');
  })
  .then(() => {
    // Sync database schema
    console.log('\n🔄 Initializing database...');
    console.log('📋 Creating database schema...');
    return models.sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log('✅ Database schema created');
  })
  .then(() => {
    // Seed questionnaire templates
    console.log('📋 Seeding questionnaire templates...');
    return seedQuestionnaireTemplates();
  })
  .then(() => {
    console.log('✅ Database initialization complete\n');
  })
  .catch((err) => {
    console.error('✗ Database error:', err.message);
    console.error('💡 If you see SQLITE_IOERR, try: rm -rf dating_app.db* && npm run dev');
  });

// Seed questionnaire templates on startup using templates data file
async function seedQuestionnaireTemplates() {
  const templates = getQuestionnaireTemplates();

  for (const template of templates) {
    // Find or create the questionnaire
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

// Routes
app.use(routes);

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
