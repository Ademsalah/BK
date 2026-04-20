// models/Ticket.js
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define("Ticket", {
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.FLOAT,
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: "userId",
    });

    Ticket.belongsTo(models.Event, {
      foreignKey: "eventId",
    });
  };

  return Ticket;
};
