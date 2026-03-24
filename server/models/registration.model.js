module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Registration", {
    dateinscription: DataTypes.DATE,
    statut: DataTypes.ENUM("en attente", "accepte", "refuse", "annule"),
    montantpaye: DataTypes.FLOAT,
    modedepaiement: DataTypes.ENUM(
      "espece",
      "virement",
      "cheque",
      "carte bancaire",
    ),
  });
};
