module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Budget", {
    montantReel: DataTypes.FLOAT,
    montantPropose: DataTypes.FLOAT,
    devise: DataTypes.STRING,
    status: DataTypes.ENUM("en attente", "accepte", "refuse", "annule"),
  });
};
