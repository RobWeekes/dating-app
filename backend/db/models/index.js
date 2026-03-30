// backend/db/models/index.js

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

require('dotenv').config();

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../../config/database.js')[env];

const models = {};

let sequelize;

if (config.use_env_variable) {
  const connectionString = process.env[config.use_env_variable];

  if (!connectionString) {
    throw new Error(`Missing required environment variable: ${config.use_env_variable}`);
  }

  sequelize = new Sequelize(connectionString, config);
} else {
  sequelize = new Sequelize(config);
}

// Load all models
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== basename)
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Associate models
Object.keys(models).forEach((modelName) => {
  if (typeof models[modelName].associate === 'function') {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;


module.exports = models;