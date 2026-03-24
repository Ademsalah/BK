module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Recommendation", {
    score: DataTypes.FLOAT,
    critére: DataTypes.STRING,
  });
};
