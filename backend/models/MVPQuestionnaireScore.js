/**
 * MVP Questionnaire Score Model
 * Stores compatibility scores between two users based on MVP questionnaire responses
 */
module.exports = (sequelize, DataTypes) => {
  const MVPQuestionnaireScore = sequelize.define(
    'MVPQuestionnaireScore',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      userId2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      personalityScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Big Five personality compatibility (0-100)',
      },
      valuesScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Core values alignment (0-100)',
      },
      familyScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Family planning compatibility (0-100)',
      },
      financialScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Financial attitudes compatibility (0-100)',
      },
      lifestyleScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Lifestyle preferences compatibility (0-100)',
      },
      workLifeScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Work-life balance compatibility (0-100)',
      },
      healthScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Health & wellness compatibility (0-100)',
      },
      physicalScore: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: 'Physical preferences compatibility (0-100)',
      },
      overallCompatibilityScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
        comment: 'Weighted overall score (0-100)',
      },
      matchRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
        comment: '1-5 stars based on overall score',
      },
      redFlags: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Array of critical incompatibilities detected',
      },
      incompatibilityReasons: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Detailed reasons for low scores',
      },
      calculatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
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
      tableName: 'mvp_questionnaire_scores',
      timestamps: true,
      indexes: [
        {
          fields: ['userId1', 'userId2'],
          unique: true,
        },
      ],
    }
  );

  MVPQuestionnaireScore.associate = (models) => {
    MVPQuestionnaireScore.belongsTo(models.User, {
      foreignKey: 'userId1',
      as: 'user1',
      onDelete: 'CASCADE',
    });
    MVPQuestionnaireScore.belongsTo(models.User, {
      foreignKey: 'userId2',
      as: 'user2',
      onDelete: 'CASCADE',
    });
  };

  return MVPQuestionnaireScore;
};
