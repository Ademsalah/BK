module.exports = (sequelize, DataTypes) => {
  const Participant = sequelize.define("Participant", {
    preferences: DataTypes.STRING,
    newsletter: DataTypes.BOOLEAN,
  });
  Participant.associate = (models) => {
    Participant.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Participant;
};
