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

    // Create questions - comprehensive Essential Questionnaire (27 questions)
    const essentialQuestions = [
      // Love & Connection (1)
      {
        questionnaireId: essentialQ.id,
        text: 'What is your love language? (Select top 2)',
        type: 'checkbox',
        options: ['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'],
        required: true,
        order: 1,
      },
      // Political Compass (2)
      {
        questionnaireId: essentialQ.id,
        text: 'My political views are:',
        type: 'radio',
        options: ['Left/Progressive', 'Center-Left', 'Center-Right', 'Right/Conservative'],
        required: true,
        order: 2,
      },
      // Birth Order (3)
      {
        questionnaireId: essentialQ.id,
        text: 'Birth order:',
        type: 'radio',
        options: ['Only child', 'First born', 'Middle child', 'Baby of the family'],
        required: true,
        order: 3,
      },
      // Sleep Tendency (4)
      {
        questionnaireId: essentialQ.id,
        text: 'Sleep pattern:',
        type: 'radio',
        options: ['Early bird', 'Standard (sleep around midnight)', 'Night owl', 'Vampire'],
        required: true,
        order: 4,
      },
      // Personality Archetype (5)
      {
        questionnaireId: essentialQ.id,
        text: 'My personality archetype is:',
        type: 'radio',
        options: ['The Hero', 'The Shadow', 'The Wise Old Man/Woman', 'The Innocent', 'The Explorer', 'The Lover', 'The Creator', 'The Caregiver', 'The Everyman', 'The Jester', 'The Sage', 'The Magician'],
        required: true,
        order: 5,
      },
      // Social Inclination (6) - stored as number 0-100
      {
        questionnaireId: essentialQ.id,
        text: 'Social inclination (Introvert to Extrovert):',
        type: 'range',
        options: ['0', '100'],
        required: true,
        order: 6,
      },
      // Sense of Humor (7)
      {
        questionnaireId: essentialQ.id,
        text: 'My sense of humor is:',
        type: 'radio',
        options: ['Slapstick', 'Playful/Silly', 'Dry/Sarcastic', 'Serious/Only when in mood', "I don't like jokes"],
        required: true,
        order: 7,
      },
      // Laughter Frequency (8)
      {
        questionnaireId: essentialQ.id,
        text: 'How often do you laugh?',
        type: 'radio',
        options: ['Easily & often', 'Sometimes', 'Only in the right company', 'Life is serious, I take it serious'],
        required: true,
        order: 8,
      },
      // Musical Tastes (9)
      {
        questionnaireId: essentialQ.id,
        text: 'What music genres do you enjoy?',
        type: 'checkbox',
        options: ['Pop', 'Rock', 'Hip-Hop/Rap', 'Country', 'R&B/Soul', 'Jazz', 'Electronic/EDM', 'Classical', 'Indie', 'Metal', 'Latin', 'Folk', 'K-Pop', 'Disco', 'Reggae'],
        required: true,
        order: 9,
      },
      // Indoor vs Outdoor (10)
      {
        questionnaireId: essentialQ.id,
        text: 'Indoor vs Outdoor preference:',
        type: 'range',
        options: ['0', '100'],
        required: true,
        order: 10,
      },
      // Entertainment Preferences (11)
      {
        questionnaireId: essentialQ.id,
        text: 'Entertainment preferences:',
        type: 'checkbox',
        options: ['Travel', 'Movies', 'TV/Shows', 'Music/Concerts', 'Gaming', 'Exercise/Gym', 'Outdoor activities', 'Reading', 'Cooking', 'Art/Museums', 'Dining out', 'Nightlife/Clubs'],
        required: true,
        order: 11,
      },
      // Hobbies (12)
      {
        questionnaireId: essentialQ.id,
        text: 'What are your hobbies?',
        type: 'checkbox',
        options: ['Photography', 'Painting/Drawing', 'Writing', 'Music (playing)', 'Sports', 'Yoga', 'Meditation', 'DIY/Crafts', 'Cooking', 'Gardening', 'Collecting', 'Volunteering', 'Gaming', 'Movies', 'Reading'],
        required: true,
        order: 12,
      },
      // Outdoor Activities (13)
      {
        questionnaireId: essentialQ.id,
        text: 'Outdoor activities:',
        type: 'checkbox',
        options: ['Hiking', 'Camping', 'Rock climbing', 'Water sports', 'Cycling', 'Picnicking', 'Beach activities', 'Skiing/Snowboarding', 'Fishing', 'Kayaking', 'Skateboarding', 'Running/Jogging'],
        required: true,
        order: 13,
      },
      // Socialization Frequency (14)
      {
        questionnaireId: essentialQ.id,
        text: 'How often do you socialize?',
        type: 'radio',
        options: ['Occasionally', 'Once a month', 'Once a week', 'More than once per week'],
        required: true,
        order: 14,
      },
      // Drinking Habits (15)
      {
        questionnaireId: essentialQ.id,
        text: 'Drinking habits:',
        type: 'radio',
        options: ["I don't drink", 'Recovered alcoholic', 'Once in a while', 'Social drinker', 'Party animal'],
        required: true,
        order: 15,
      },
      // Smoking (16)
      {
        questionnaireId: essentialQ.id,
        text: 'Do you smoke?',
        type: 'radio',
        options: ['No', 'Rarely', 'Weekly', 'Daily'],
        required: true,
        order: 16,
      },
      // Recreational Drugs (17)
      {
        questionnaireId: essentialQ.id,
        text: 'Recreational drugs:',
        type: 'radio',
        options: ['None', 'Cannabis', 'Psychedelics', 'Heavy user'],
        required: true,
        order: 17,
      },
      // Pets (18)
      {
        questionnaireId: essentialQ.id,
        text: 'Regarding pets:',
        type: 'radio',
        options: ['Have pets', 'Want pets', "Don't want pets"],
        required: true,
        order: 18,
      },
      // Personality Era (19)
      {
        questionnaireId: essentialQ.id,
        text: 'My personality is most like the:',
        type: 'radio',
        options: ["'50s", "'60s", "'70s/'80s", "'90s"],
        required: true,
        order: 19,
      },
      // Conflict Style (20)
      {
        questionnaireId: essentialQ.id,
        text: 'Conflict preference style:',
        type: 'radio',
        options: ['Opinionated/Speak my mind', "Don't talk unless I have something to say", 'I prefer to avoid conflict'],
        required: true,
        order: 20,
      },
      // Problem Handling (21)
      {
        questionnaireId: essentialQ.id,
        text: 'How do you handle problems/stress?',
        type: 'radio',
        options: ['Avoid problems/do something else', 'Plan solutions methodically', "Tackle problems head on/'wing it'"],
        required: true,
        order: 21,
      },
      // Financial Habits (22)
      {
        questionnaireId: essentialQ.id,
        text: 'Financial approach:',
        type: 'radio',
        options: ['Budget everything in advance', 'Check finances occasionally', "Don't worry about spending"],
        required: true,
        order: 22,
      },
      // Family Relationship (23)
      {
        questionnaireId: essentialQ.id,
        text: 'Family relationship:',
        type: 'radio',
        options: ['Not speaking', 'Talk occasionally on the phone', 'Regular phone calls', 'Regular visits'],
        required: true,
        order: 23,
      },
      // Dating Duration (24)
      {
        questionnaireId: essentialQ.id,
        text: 'Dating duration before engagement:',
        type: 'radio',
        options: ['6 months or less', '6-12 months', '1-2 years', '3-4 years', '5 years+'],
        required: true,
        order: 24,
      },
      // Engagement Duration (25)
      {
        questionnaireId: essentialQ.id,
        text: 'Engagement duration before wedding:',
        type: 'radio',
        options: ['6 months or less', '6-12 months', '1-2 years', '3-4 years', '5 years+'],
        required: true,
        order: 25,
      },
      // What are you looking for? (26)
      {
        questionnaireId: essentialQ.id,
        text: 'What are you looking for?',
        type: 'radio',
        options: ['Something serious', 'Casual dating', 'Not sure'],
        required: true,
        order: 26,
      },
      // Do you want kids? (27)
      {
        questionnaireId: essentialQ.id,
        text: 'Do you want kids?',
        type: 'radio',
        options: ['Yes', 'No', 'Maybe'],
        required: true,
        order: 27,
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
