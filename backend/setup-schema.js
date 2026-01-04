#!/usr/bin/env node
/**
 * Setup Script - Creates new schema and seeds initial data
 * Run: node backend/setup-schema.js
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const dbPath = path.join(__dirname, 'dating_app.db');

async function setup() {
  try {
    console.log('🚀 Starting schema setup...\n');

    // Step 1: Delete old database
    console.log('📋 Step 1: Deleting old database...');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✅ Old database deleted\n');
    } else {
      console.log('✅ No old database found\n');
    }

    // Step 2: Initialize Sequelize and sync models
    console.log('📋 Step 2: Creating new schema...');
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbPath,
      logging: false,
    });

    // Load models
    const models = {};
    fs.readdirSync(__dirname + '/models')
      .filter((file) => file.endsWith('.js') && file !== 'index.js')
      .forEach((file) => {
        const model = require(path.join(__dirname, 'models', file))(
          sequelize,
          Sequelize.DataTypes
        );
        models[model.name] = model;
      });

    // Associate models
    Object.keys(models).forEach((modelName) => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });

    // Sync all models
    await sequelize.sync({ force: true });
    console.log('✅ New schema created\n');

    // Step 3: Seed questionnaire templates
    console.log('📋 Step 3: Seeding questionnaire templates...');

    const Questionnaire = models.Questionnaire;
    const Question = models.Question;

    // Create Essential Questionnaire template
    const essentialQ = await Questionnaire.create({
      type: 'essential',
      title: 'Essential Questionnaire',
      description: 'Find out what matters most to you in a relationship',
      category: 'Essential',
      version: 1,
      isActive: true,
    });

    console.log(`  ✓ Created Essential Questionnaire (ID: ${essentialQ.id})`);

    // Create questions for Essential Questionnaire
    const essentialQuestions = [
      {
        questionnaireId: essentialQ.id,
        text: 'What are you looking for?',
        type: 'radio',
        options: JSON.stringify(['Something serious', 'Casual dating', 'Not sure']),
        required: true,
        order: 1,
      },
      {
        questionnaireId: essentialQ.id,
        text: 'Do you want kids?',
        type: 'radio',
        options: JSON.stringify(['Yes', 'No', 'Maybe']),
        required: true,
        order: 2,
      },
      {
        questionnaireId: essentialQ.id,
        text: 'What is your relationship style?',
        type: 'radio',
        options: JSON.stringify(['Monogamous', 'Open relationship', 'Exploring options']),
        required: true,
        order: 3,
      },
      {
        questionnaireId: essentialQ.id,
        text: 'What are your interests?',
        type: 'checkbox',
        options: JSON.stringify([
          'Travel',
          'Fitness',
          'Art',
          'Music',
          'Cooking',
          'Gaming',
          'Reading',
          'Sports',
        ]),
        required: false,
        order: 4,
      },
    ];

    await Question.bulkCreate(essentialQuestions);
    console.log(`  ✓ Created ${essentialQuestions.length} questions`);
    console.log('✅ Questionnaire templates seeded\n');

    // Step 4: Verify schema
    console.log('📋 Step 4: Verifying schema...');
    const tables = await sequelize.queryInterface.showAllTables();
    console.log('  Tables created:');
    tables.forEach((table) => {
      console.log(`    • ${table}`);
    });
    console.log('');

    // Step 5: Summary
    console.log('=' + '='.repeat(70));
    console.log('✅ SCHEMA SETUP COMPLETE!');
    console.log('=' + '='.repeat(70));
    console.log('\n📊 Database Summary:');
    console.log(`  Location: ${dbPath}`);
    console.log(`  Tables: ${tables.length}`);
    console.log(`  Questionnaires: 1 (Essential)`);
    console.log(`  Questions: 4\n`);

    console.log('🚀 Next Steps:');
    console.log('  1. Start backend: npm run dev (in backend/)\n');
    console.log('  2. Test endpoints:');
    console.log('     GET  http://localhost:3001/api/questionnaires');
    console.log('     GET  http://localhost:3001/api/questionnaires/1');
    console.log('     GET  http://localhost:3001/api/questionnaires/type/essential\n');
    console.log('  3. Submit a questionnaire (with auth token):');
    console.log('     POST http://localhost:3001/api/questionnaires');
    console.log('     Body: {"type":"essential", "responses": {"1":"Something serious"}}\n');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setup();
