/**
 * Like Model
 * Tracks user interactions - who liked whom
 */
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fromUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      toUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
      tableName: 'likes',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['fromUserId', 'toUserId'], // Prevent duplicate likes
        },
      ],
    }
  );

  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      as: 'fromUser',
      foreignKey: 'fromUserId',
      onDelete: 'CASCADE',
    });
    Like.belongsTo(models.User, {
      as: 'toUser',
      foreignKey: 'toUserId',
      onDelete: 'CASCADE',
    });
  };

  return Like;
};
