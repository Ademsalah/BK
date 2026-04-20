// models/EventPrestataire.js
module.exports = (sequelize, DataTypes) => {
  const EventPrestataire = sequelize.define("EventPrestataire", {
    proposedPrice: DataTypes.FLOAT,
    status: {
      type: DataTypes.ENUM("PENDING", "ACCEPTED", "REFUSED"),
      defaultValue: "PENDING",
    },
  });

  EventPrestataire.associate = (models) => {
    EventPrestataire.belongsTo(models.Event, {
      foreignKey: "eventId",
    });

    EventPrestataire.belongsTo(models.PrestataireProfile, {
      foreignKey: "prestataireId",
    });
  };

  return EventPrestataire;
};
