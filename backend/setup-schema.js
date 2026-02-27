#!/usr/bin/env node
/**
 * Setup Script - Creates new schema and seeds initial data
 * Run: node backend/setup-schema.js
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { getQuestionnaireTemplates } = require('./data/questionnaire-templates');

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

    // Step 3: Seed questionnaire templates from central data file
    console.log('📋 Step 3: Seeding questionnaire templates...');

    const templates = getQuestionnaireTemplates();
    let totalQuestions = 0;

    for (const template of templates) {
      const questionnaire = await models.Questionnaire.create({
        type: template.type,
        title: template.title,
        description: template.description,
        category: template.category,
        version: 1,
        isActive: true,
      });

      const questions = template.questions.map(q => ({
        questionnaireId: questionnaire.id,
        text: q.text,
        type: q.type,
        options: q.options,
        required: q.required,
        order: q.order,
        section: q.section,
        sectionDescription: q.sectionDescription,
        reversed: q.reversed,
        critical: q.critical,
        conditional: q.conditional,
      }));

      await models.Question.bulkCreate(questions);
      totalQuestions += questions.length;
      console.log(`  ✓ Created ${template.type} questionnaire (${questions.length} questions)`);
    }

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
    console.log(`  Questionnaires: ${templates.length}`);
    console.log(`  Questions: ${totalQuestions}\n`);

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
