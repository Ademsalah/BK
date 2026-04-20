const db = require("../models");
const Event = db.Event;

// CREATE
exports.createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    adminId: req.user.id,
  });

  res.json(event);
};

// GET ALL
exports.getEvents = async (req, res) => {
  const events = await Event.findAll();
  res.json(events);
};

// UPDATE
exports.updateEvent = async (req, res) => {
  await Event.update(req.body, {
    where: { id: req.params.id },
  });

  res.json({ message: "Updated" });
};

// DELETE
exports.deleteEvent = async (req, res) => {
  await Event.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};