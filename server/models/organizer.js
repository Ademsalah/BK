module.exports = (sequelize, DataTypes) => {
  const Organizer = sequelize.define("Organizer", {
    companyName: DataTypes.STRING,
  });

  Organizer.associate = (models) => {
    Organizer.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Organizer;
};
