/**
 * Questionnaire Model
 * Stores user's personality and dating questionnaire responses
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      questionnaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      interests: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      datingGoal: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      relationshipType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      responses: {
        type: DataTypes.JSON,
        defaultValue: {},
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
    Questionnaire.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Questionnaire;
};
