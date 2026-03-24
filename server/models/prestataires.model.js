module.exports = (sequelize, DataTypes) => {
  const Prestataire = sequelize.define("Prestataires", {
    companyName: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    logo: DataTypes.STRING,
    noteMoyenne: DataTypes.FLOAT,
  });
  Prestataire.associate = (models) => {
    Prestataire.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Prestataire;
};
