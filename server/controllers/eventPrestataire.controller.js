const db = require("../models");
const EventPrestataire = db.EventPrestataire;

exports.assign = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { eventId, team } = req.body;

    if (!eventId || !Array.isArray(team) || team.length === 0) {
      return res.status(400).json({
        message: "eventId and team are required",
      });
    }

    const created = [];

    for (const p of team) {
      const assignment = await EventPrestataire.create(
        {
          eventId,
          prestataireId: p.prestataireId || p.id, // ✅ SAFE FIX
          proposedPrice: p.proposedPrice || p.priceMax || p.priceMin,
          status: "PENDING",
        },
        { transaction },
      );

      created.push(assignment);
    }

    await transaction.commit();

    return res.json({
      message: "Team assigned successfully",
      data: created,
    });
  } catch (err) {
    await transaction.rollback();

    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  const userId = req.params.id;

  const profile = await db.PrestataireProfile.findOne({
    where: { userId },
  });

  if (!profile) {
    return res.status(404).json({ error: "Prestataire profile not found" });
  }
  try {
    await EventPrestataire.update(
      { status: req.body.status },
      { where: { prestataireid: profile.id } },
    );

    res.json({ message: "Updated status" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const { Op } = require("sequelize");

exports.getEventsByPrestataire = async (req, res) => {
  try {
    const userId = req.params.id;

    const profile = await db.PrestataireProfile.findOne({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ error: "Prestataire profile not found" });
    }

    // query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const whereEvent = search
      ? {
          title: {
            [Op.like]: `%${search}%`,
          },
        }
      : {};

    const { rows, count } = await db.EventPrestataire.findAndCountAll({
      where: { prestataireId: profile.id },

      include: [
        {
          model: db.Event,
          where: whereEvent,
          required: search ? true : false, // only filter join if searching
        },
      ],

      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPrestataireDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // user
    const user = await db.User.findOne({
      where: {
        id,
        role: "PRESTATAIRE",
      },

      attributes: ["id", "name", "email", "banned", "createdAt"],

      include: [
        {
          model: db.PrestataireProfile,

          include: [
            {
              model: db.EventPrestataire,

              include: [
                {
                  model: db.Event,

                  attributes: ["id", "title", "date", "location", "status"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "Prestataire not found",
      });
    }

    // count events
    const totalEvents = user.PrestataireProfile?.EventPrestataires?.length || 0;

    res.json({
      user,

      stats: {
        totalEvents,
      },
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
