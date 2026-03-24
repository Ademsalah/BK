module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Expense", {
    amount: DataTypes.FLOAT,
    description: DataTypes.STRING,
    category: DataTypes.STRING,
    piecejointe: DataTypes.STRING,
  });
};
