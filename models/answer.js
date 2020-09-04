'use strict';
module.exports = (sequelize, DataTypes) => {
  const Answer = sequelize.define('Answer', {
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {});
  Answer.associate = function(models) {
    Answer.belongsTo(models.Question, { foreignKey: "questionId" });
    Answer.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Answer;
};
