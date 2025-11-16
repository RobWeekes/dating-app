/**
 * Answer Model
 * Stores individual questionnaire question responses
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
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'questionnaires',
          key: 'id',
        },
      },
      questionId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    Answer.belongsTo(models.Questionnaire, {
      foreignKey: 'questionnaireId',
      onDelete: 'CASCADE',
    });
  };

  return Answer;
};
