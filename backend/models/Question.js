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
        type: DataTypes.STRING,
        defaultValue: 'text',
        validate: {
          isIn: [['text', 'single', 'multi', 'likert', 'slider', 'range', 'radio', 'checkbox']],
        },
        comment: 'Canonical types: single, multi, likert, slider, range, text',
      },
      options: {
        type: DataTypes.JSON,
        defaultValue: [],
        comment: 'Array of choices, or config object for slider/range types',
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
      section: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Section title for grouping questions',
      },
      sectionDescription: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Section subtitle/description',
      },
      reversed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether scoring is reverse-coded (for likert scales)',
      },
      critical: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Deal-breaker question for compatibility',
      },
      conditional: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Conditional display rules: { questionOrder, values }',
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
