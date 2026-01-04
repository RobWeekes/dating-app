/**
 * QuestionnaireResponse Model
 * Tracks when a user completes a questionnaire (submission record)
 */
module.exports = (sequelize, DataTypes) => {
  const QuestionnaireResponse = sequelize.define(
    'QuestionnaireResponse',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'questionnaires',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.ENUM('in_progress', 'completed'),
        defaultValue: 'in_progress',
        validate: {
          isIn: [['in_progress', 'completed']],
        },
      },
      completedAt: {
        type: DataTypes.DATE,
        comment: 'When the user finished the questionnaire',
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
      tableName: 'questionnaire_responses',
      timestamps: true,
    }
  );

  QuestionnaireResponse.associate = (models) => {
    QuestionnaireResponse.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    QuestionnaireResponse.belongsTo(models.Questionnaire, {
      foreignKey: 'questionnaireId',
      onDelete: 'CASCADE',
    });
    QuestionnaireResponse.hasMany(models.Answer, {
      foreignKey: 'questionnaireResponseId',
      onDelete: 'CASCADE',
    });
  };

  return QuestionnaireResponse;
};
