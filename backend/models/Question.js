/**
 * Question Model
 * Stores individual questions within a questionnaire template
 */
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
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
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.ENUM('text', 'radio', 'checkbox', 'slider'),
        defaultValue: 'text',
        validate: {
          isIn: [['text', 'radio', 'checkbox', 'slider']],
        },
      },
      options: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of options for radio, checkbox types',
      },
      required: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Display order within questionnaire',
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
      tableName: 'questions',
      timestamps: true,
    }
  );

  Question.associate = (models) => {
    Question.belongsTo(models.Questionnaire, {
      foreignKey: 'questionnaireId',
      onDelete: 'CASCADE',
    });
  };

  return Question;
};
