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
// Seed test users (development only)
// ==============================
// Auto-seeds 1000 test users in development for easier testing
async function seedTestUsers() {
  if (process.env.NODE_ENV !== 'development') {
    return; // Only seed in development
  }

  try {
    const userCount = await models.User.count();

    if (userCount > 0) {
      console.log(`  ✓ Database already has ${userCount} users, skipping test user seed`);
      return;
    }

    console.log('  📝 Generating 1000 test users...');
    const bcrypt = require('bcryptjs');

    // Name pools
    const firstNames = {
      male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark'],
      female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret'],
    };

    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Garcia', 'Wilson', 'Anderson'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin', 'Denver', 'Seattle', 'Boston', 'Miami'];
    const bios = ['Adventure seeker and coffee enthusiast', 'Yoga instructor who loves outdoors', 'Travel junkie always exploring', 'Artist and musician', 'Fitness enthusiast', 'Book lover', 'Dog parent'];

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('TestPass123!', salt);
    const hashedTestPassword = await bcrypt.hash('Password', salt);

    const users = [];

    // First user: hardcoded test account
    users.push({
      email: 'test@aol.com',
      password: hashedTestPassword,
      firstName: 'Test',
      lastName: 'User',
      age: 28,
      bio: 'Test account for development',
      location: 'New York',
      profilePhotoUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Remaining 999 random users
    for (let i = 1; i <= 999; i++) {
      const isMale = Math.random() > 0.5;
      const firstName = isMale ? firstNames.male[Math.floor(Math.random() * firstNames.male.length)] : firstNames.female[Math.floor(Math.random() * firstNames.female.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      users.push({
        email: `user${i}@datingapp.test`,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        age: Math.floor(Math.random() * (65 - 18 + 1)) + 18,
        bio: bios[Math.floor(Math.random() * bios.length)],
        location: cities[Math.floor(Math.random() * cities.length)],
        profilePhotoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await models.User.bulkCreate(users);
    console.log('  ✓ Created 1000 test users (including test@aol.com)');
    console.log('✅ Test users seeded');
  } catch (err) {
    console.error('⚠️  Could not seed test users:', err.message);
    // Don't fail startup if seeding fails
  }
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

    // Seed test users (development only)
    await seedTestUsers();

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
