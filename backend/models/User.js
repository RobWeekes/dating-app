/**
 * User Model
 * Stores user profile information and authentication
 */
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 255],
          isStrongPassword(value) {
            const hasUpperCase = /[A-Z]/.test(value);
            const hasLowerCase = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);
            
            if (!hasUpperCase) {
              throw new Error('Password must contain at least one uppercase letter');
            }
            if (!hasLowerCase) {
              throw new Error('Password must contain at least one lowercase letter');
            }
            if (!hasNumber) {
              throw new Error('Password must contain at least one number');
            }
            if (!hasSpecialChar) {
              throw new Error('Password must contain at least one special character');
            }
          }
        },
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      age: {
        type: DataTypes.INTEGER,
        validate: {
          min: 18,
          max: 120,
        },
      },
      bio: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.STRING,
      },
      profilePhotoUrl: {
        type: DataTypes.STRING,
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
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // Instance method to compare passwords
  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  // Instance method to get public data (exclude password)
  User.prototype.toPublicJSON = function () {
    const json = this.toJSON();
    delete json.password;
    return json;
  };

  User.associate = (models) => {
    User.hasOne(models.Questionnaire, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    User.hasOne(models.Preference, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return User;
};
