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
      bodyType: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['Thin', 'Average', 'Athletic/Toned', 'Muscular', 'Curvy', 'Plump', 'Big & Beautiful']],
        },
      },
      bmi: {
        type: DataTypes.DECIMAL(5, 2),
        validate: {
          isDecimal: true,
          min: 10,
          max: 60,
        },
      },
      politics: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['Progressive Left', 'Moderate Left', 'Independent', 'Moderate Right', 'Traditional Conservative']],
        },
      },
      religion: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['Not religious', 'Christian', 'Catholic', 'Protestant', 'Baptist', 'Jewish Orthodox', 'Jewish Reform', 'Muslim', 'Hindu', 'Agnostic', 'Atheist']],
        },
      },
      ethnicity: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['White', 'Black/African American', 'Hispanic/Latino', 'Asian', 'Native American', 'Pacific Islander', 'Middle Eastern/North African', 'Mixed Race', 'Other']],
        },
      },
      family: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['Single/Never Married', 'Divorced with Children', 'Divorced No Children']],
        },
      },
      familyGoals: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Don't Want Kids/Any More Kids", 'Want Kids/More Kids']],
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
    User.hasMany(models.QuestionnaireResponse, {
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
