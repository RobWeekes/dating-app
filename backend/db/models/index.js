const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

// Use SQLite for development
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../dating_app.db'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

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
