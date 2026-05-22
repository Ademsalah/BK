const db = require("../models");

const Ticket = db.Ticket;
const Event = db.Event;

exports.bookTicket = async (req, res) => {
  try {
    const { eventId, quantity, userId } = req.body;

    // find event
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // check capacity
    const remainingTickets = event.capacity - event.bookedTickets;

    if (quantity > remainingTickets) {
      return res.status(400).json({
        message: `Only ${remainingTickets} tickets remaining`,
      });
    }

    // calculate total
    const totalPrice = event.ticketPrice * quantity;

    // create ticket
    const ticket = await Ticket.create({
      userId,
      eventId,
      quantity,
      totalPrice,
    });

    // update booked tickets
    event.bookedTickets += quantity;

    // update status if full
    if (event.bookedTickets >= event.capacity) {
      event.status = "non disponible";
    }

    await event.save();

    res.json({
      message: "Ticket booked successfully",
      ticket,
      bookedTickets: event.bookedTickets,
      remainingTickets: event.capacity - event.bookedTickets,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
