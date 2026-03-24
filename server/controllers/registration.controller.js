// controllers/registration.controller.js
const db = require("../models");

exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await db.Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // check capacity
    const count = await db.Registration.count({ where: { EventId: eventId } });

    if (count >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // prevent duplicate
    const exist = await db.Registration.findOne({
      where: {
        EventId: eventId,
        UserId: req.user.id,
      },
    });

    if (exist) {
      return res.status(400).json({ message: "Already joined" });
    }

    const registration = await db.Registration.create({
      EventId: eventId,
      UserId: req.user.id,
    });

    // 🔔 CREATE NOTIFICATION
    await db.Notification.create({
      title: "New participant 🎉",
      message: `User ${req.user.id} joined your event`,
      type: "event",
      status: "unread",
      UserId: event.organizerId, // send to organizer
    });

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
