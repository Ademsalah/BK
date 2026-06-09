const { BULKDELETE } = require("sequelize/lib/query-types");
const db = require("../models");
const Event = db.Event;
const User = db.User;
const EventPrestataire = db.EventPrestataire;
const PrestataireProfile = db.PrestataireProfile;
const { Op } = require("sequelize");
// CREATE
exports.createEvent = async (req, res) => {
  try {
    const photos = req.files ? req.files.map((file) => file.path) : [];
    const event = await Event.create({
      ...req.body,
      photos,
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
  try {
    const { id } = req.params;

    // 1. Find event first
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

   

    // 3. Handle new uploaded photos (if any)
    let photos = event.photos || [];

    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map((file) => file.path);

      // option A: replace all photos
      // photos = newPhotos;

      // option B: append photos (recommended)
      photos = [...photos, ...newPhotos];
    }

    // 4. Update only allowed fields (safer than req.body spread)
    const allowedFields = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      date: req.body.date,
      price: req.body.price,
      category: req.body.category,
      capacity: req.body.capacity,
      photos,
      budget: req.body.budget,
    };

    // remove undefined fields (avoid overwriting with null)
    Object.keys(allowedFields).forEach(
      (key) => allowedFields[key] === undefined && delete allowedFields[key],
    );

    // 5. Update event
    await event.update(allowedFields);

    res.json({
      message: "Event updated successfully",
      data: event,
    });
  } catch (err) {
    console.log("UPDATE EVENT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
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
      include: [
        {
          model: EventPrestataire,
          include: [
            {
              model: PrestataireProfile,
              include: [
                {
                  model: User,
                  attributes: ["id", "name", "email", "role"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
