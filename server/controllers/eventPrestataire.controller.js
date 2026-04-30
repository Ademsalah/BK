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
        { transaction }
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
  try {
    await EventPrestataire.update(
      { status: req.body.status },
      { where: { id: req.params.id } },
    );

    res.json({ message: "Updated status" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
