module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM("admin", "participant", "prestataire", "organizer"),
    telephone: DataTypes.STRING,
    photo: DataTypes.STRING,
  });
  User.associate = (models) => {
    User.hasOne(models.Admin, { foreignKey: "userId" });
    User.hasOne(models.Organizer, { foreignKey: "userId" });
    User.hasOne(models.Prestataires, { foreignKey: "userId" });
    User.hasOne(models.Participant, { foreignKey: "userId" });
  };

  return User;
};
