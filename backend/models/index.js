const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  process.env.DB_NAME || config.development.database,
  process.env.DB_USER || config.development.username,
  process.env.DB_PASSWORD || config.development.password,
  {
    host: process.env.DB_HOST || config.development.host,
    port: process.env.DB_PORT || config.development.port,
    dialect: process.env.DB_DIALECT || config.development.dialect,
    logging: false,
  }
);

const models = {};

// Load all models
fs.readdirSync(__dirname)
  .filter((file) => file.endsWith('.js') && file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Associate models
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
