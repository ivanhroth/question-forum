'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Question, { foreignKey: "userId" });
    User.hasMany(models.Answer, { foreignKey: "userId" });
  };
  return User;
};
