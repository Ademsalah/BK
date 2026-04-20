// models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define("Event", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    totalBudget: DataTypes.FLOAT,
  });

  Event.associate = (models) => {
    Event.belongsTo(models.User, {
      as: "admin",
      foreignKey: "adminId",
    });

    Event.hasMany(models.EventPrestataire, {
      foreignKey: "eventId",
    });

    Event.hasMany(models.Ticket, {
      foreignKey: "eventId",
    });
  };

  return Event;
};
