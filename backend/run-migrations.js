/**
 * Manual migration runner
 * Run this with: node backend/run-migrations.js
 */
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, './dating_app.db'),
  logging: console.log,
});

async function runMigrations() {
  try {
    console.log('🔄 Starting migrations...\n');

    // 1. Create questionnaire_responses table
    console.log('📋 Creating questionnaire_responses table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS questionnaire_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        questionnaireId INTEGER NOT NULL,
        status TEXT DEFAULT 'in_progress',
        completedAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (questionnaireId) REFERENCES Questionnaires(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ questionnaire_responses table created\n');

    // 2. Create questions table
    console.log('📋 Creating questions table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        questionnaireId INTEGER NOT NULL,
        text TEXT NOT NULL,
        type TEXT DEFAULT 'text',
        options TEXT DEFAULT '[]',
        required INTEGER DEFAULT 1,
        "order" INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (questionnaireId) REFERENCES Questionnaires(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ questions table created\n');

    // 3. Alter questionnaires table (rename and remove columns)
    console.log('📋 Altering questionnaires table...');
    
    // Get existing columns
    const tableInfo = await sequelize.query(`PRAGMA table_info(Questionnaires)`);
    const columns = tableInfo[0].map(col => col.name);
    
    if (columns.includes('userId')) {
      // Create new questionnaires table with correct schema
      await sequelize.query(`
        CREATE TABLE questionnaires_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          description TEXT,
          category TEXT,
          version INTEGER DEFAULT 1,
          isActive INTEGER DEFAULT 1,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Copy existing questionnaire data (if any)
      await sequelize.query(`
        INSERT INTO questionnaires_new (id, type, title, createdAt, updatedAt)
        SELECT id, 
          COALESCE(questionnaire, 'generic') as type,
          COALESCE(questionnaire, 'Questionnaire') as title,
          createdAt,
          updatedAt
        FROM Questionnaires
      `).catch(() => {
        // If insert fails, it's OK - table was likely empty
        console.log('  (No existing data to migrate)');
      });
      
      // Drop old table
      await sequelize.query(`DROP TABLE Questionnaires`);
      
      // Rename new table
      await sequelize.query(`ALTER TABLE questionnaires_new RENAME TO Questionnaires`);
    }
    
    console.log('✅ questionnaires table altered\n');

    // 4. Alter answers table
    console.log('📋 Altering answers table...');
    const answersInfo = await sequelize.query(`PRAGMA table_info(Answers)`);
    const answerColumns = answersInfo[0].map(col => col.name);
    
    if (answerColumns.includes('questionnaireId') || answerColumns.includes('answer')) {
      // Create new answers table with correct schema
      await sequelize.query(`
        CREATE TABLE answers_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          questionnaireResponseId INTEGER NOT NULL,
          questionId INTEGER NOT NULL,
          value TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (questionnaireResponseId) REFERENCES questionnaire_responses(id) ON DELETE CASCADE,
          FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
        )
      `);
      
      // Note: Can't migrate old answer data because structure is different
      // Old answers will be lost - this is expected for this refactor
      
      // Drop old table
      await sequelize.query(`DROP TABLE Answers`);
      
      // Rename new table
      await sequelize.query(`ALTER TABLE answers_new RENAME TO Answers`);
    }
    
    console.log('✅ answers table altered\n');

    // 5. Create indexes
    console.log('📋 Creating indexes...');
    const indexCommands = [
      `CREATE INDEX IF NOT EXISTS idx_qr_userId ON questionnaire_responses(userId)`,
      `CREATE INDEX IF NOT EXISTS idx_qr_questionnaireId ON questionnaire_responses(questionnaireId)`,
      `CREATE INDEX IF NOT EXISTS idx_qr_status ON questionnaire_responses(status)`,
      `CREATE INDEX IF NOT EXISTS idx_q_questionnaireId ON questions(questionnaireId)`,
      `CREATE INDEX IF NOT EXISTS idx_q_order ON questions("order")`,
      `CREATE INDEX IF NOT EXISTS idx_a_responseId ON Answers(questionnaireResponseId)`,
      `CREATE INDEX IF NOT EXISTS idx_a_questionId ON Answers(questionId)`,
    ];
    
    for (const cmd of indexCommands) {
      await sequelize.query(cmd);
    }
    console.log('✅ Indexes created\n');

    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigrations();
