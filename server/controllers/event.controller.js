const db = require("../models");
const Event = db.Event;
const { Op } = require("sequelize");
// CREATE
exports.createEvent = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("USER:", req.user);

    const event = await Event.create({
      ...req.body,
      adminId: req.user.id,
    });

    res.json(event);
  } catch (err) {
    console.log("SEQUELIZE ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ message: err.message });
  }
};
// GET ALL with pagination + search (title, location, description)
exports.getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { search } = req.query;

    const where = {};

    // 🔍 Search by title OR location OR description
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findOne({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
