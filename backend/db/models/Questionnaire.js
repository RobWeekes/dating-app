/**
 * Questionnaire Model
 * Stores questionnaire templates/definitions (reusable across users)
 */
module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define(
    'Questionnaire',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
        comment: 'e.g., "essential", "compatibility", "interests"',
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'For organization/grouping questionnaires',
      },
      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        comment: 'Track changes to questionnaire over time',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Can deactivate without deleting',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'questionnaires',
      timestamps: true,
    }
  );

  Questionnaire.associate = (models) => {
    Questionnaire.hasMany(models.Question, {
      foreignKey: 'questionnaireId',
      onDelete: 'CASCADE',
    });
    Questionnaire.hasMany(models.QuestionnaireResponse, {
      foreignKey: 'questionnaireId',
      onDelete: 'CASCADE',
    });
  };

  return Questionnaire;
};
