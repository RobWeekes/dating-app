/**
 * Preference Model
 * Stores user's dating preferences and match filters
 */
module.exports = (sequelize, DataTypes) => {
  const Preference = sequelize.define(
    'Preference',
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
      minAge: {
        type: DataTypes.INTEGER,
        defaultValue: 18,
        validate: {
          min: 18,
          max: 120,
        },
      },
      maxAge: {
        type: DataTypes.INTEGER,
        defaultValue: 100,
        validate: {
          min: 18,
          max: 120,
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      locationRadius: {
        type: DataTypes.INTEGER,
        defaultValue: 50,
      },
      interests: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      relationshipType: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: 'preferences',
      timestamps: true,
    }
  );

  Preference.associate = (models) => {
    Preference.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Preference;
};
