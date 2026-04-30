// models/PrestataireProfile.js
module.exports = (sequelize, DataTypes) => {
  const PrestataireProfile = sequelize.define("PrestataireProfile", {
    category: DataTypes.ENUM("TRAITEUR", "MUSICIEN", "SALLE", "DECORATION"),
    priceMin: DataTypes.FLOAT,
    priceMax: DataTypes.FLOAT,
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    location: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

 PrestataireProfile.associate = (models) => {
  PrestataireProfile.belongsTo(models.User, {
    foreignKey: "userId",
  });

  PrestataireProfile.hasMany(models.EventPrestataire, {
    foreignKey: "prestataireId",
  });
};

  return PrestataireProfile;
};
