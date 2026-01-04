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

// Database connection and initialization
models.sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connection successful');
    // Sync database schema
    console.log('\n🔄 Initializing database...');
    console.log('📋 Creating database schema...');
    return models.sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log('✅ Database schema created');
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

// Seed questionnaire templates on startup
async function seedQuestionnaireTemplates() {
  const existingCount = await models.Questionnaire.count();
  if (existingCount === 0) {
    // Create Essential Questionnaire template
    const essentialQ = await models.Questionnaire.create({
      type: 'essential',
      title: 'Essential Questionnaire',
      description: 'Find out what matters most to you in a relationship',
      category: 'Essential',
      version: 1,
      isActive: true,
    });

    console.log(`  ✓ Created Essential Questionnaire (ID: ${essentialQ.id})`);

    // Create questions
    const essentialQuestions = [
      {
        questionnaireId: essentialQ.id,
        text: 'What are you looking for?',
        type: 'radio',
        options: ['Something serious', 'Casual dating', 'Not sure'],
        required: true,
        order: 1,
      },
      {
        questionnaireId: essentialQ.id,
        text: 'Do you want kids?',
        type: 'radio',
        options: ['Yes', 'No', 'Maybe'],
        required: true,
        order: 2,
      },
      {
        questionnaireId: essentialQ.id,
        text: 'What is your relationship style?',
        type: 'radio',
        options: ['Monogamous', 'Open relationship', 'Exploring options'],
        required: true,
        order: 3,
      },
      {
        questionnaireId: essentialQ.id,
        text: 'What are your interests?',
        type: 'checkbox',
        options: [
          'Travel',
          'Fitness',
          'Art',
          'Music',
          'Cooking',
          'Gaming',
          'Reading',
          'Sports',
        ],
        required: false,
        order: 4,
      },
    ];

    await models.Question.bulkCreate(essentialQuestions);
    console.log(`  ✓ Created ${essentialQuestions.length} questions`);
    console.log('✅ Questionnaire templates seeded');
  } else {
    console.log(`✅ Database already initialized (${existingCount} questionnaires found)`);
  }
}

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
