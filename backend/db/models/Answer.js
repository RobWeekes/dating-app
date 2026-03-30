/**
 * Answer Model
 * Stores individual user responses to specific questions
 */
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define(
    'Answer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      questionnaireResponseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'The actual answer - can be text, number, or JSON',
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
      tableName: 'answers',
      timestamps: true,
    }
  );

  Answer.associate = (models) => {
    Answer.belongsTo(models.QuestionnaireResponse, {
      foreignKey: 'questionnaireResponseId',
      onDelete: 'CASCADE',
    });
    Answer.belongsTo(models.Question, {
      foreignKey: 'questionId',
      onDelete: 'CASCADE',
    });
  };

  return Answer;
};
