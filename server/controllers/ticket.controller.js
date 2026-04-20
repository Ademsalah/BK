const db = require("../models");
const Ticket = db.Ticket;

exports.bookTicket = async (req, res) => {
  const ticket = await Ticket.create({
    userId: req.user.id,
    eventId: req.body.eventId,
    quantity: req.body.quantity,
    totalPrice: req.body.totalPrice,
  });

  res.json(ticket);
};