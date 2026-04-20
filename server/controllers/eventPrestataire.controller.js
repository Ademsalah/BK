const db = require("../models");
const EventPrestataire = db.EventPrestataire;

exports.assign = async (req, res) => {
  try {
    const assignment = await EventPrestataire.create({
      eventId: req.body.eventId,
      prestataireId: req.body.prestataireId,
      proposedPrice: req.body.proposedPrice,
      status: "PENDING",
    });

    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
