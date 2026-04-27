const db = require("../models");
const User = db.User;
const { Op } = require("sequelize");

// 📥 GET ALL PARTICIPANTS (pagination + search)
exports.getParticipants = async (req, res) => {
  try {
    const { page = 1, limit = 12, search = "" } = req.query;

    const offset = (page - 1) * limit;

    const where = {
      role: "PARTICIPANT",
      ...(search
        ? {
            [Op.or]: [
              { name: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
            ],
          }
        : {}),
    };

    const { rows, count } = await User.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getParticipantById = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        role: "PARTICIPANT",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateParticipant = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user || user.role !== "PARTICIPANT") {
      return res.status(404).json({ message: "Participant not found" });
    }

    await user.update(req.body);

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteParticipant = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user || user.role !== "PARTICIPANT") {
      return res.status(404).json({ message: "Participant not found" });
    }

    await user.destroy();

    res.json({ message: "Participant deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.toggleBan = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        role: "PARTICIPANT",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Participant not found" });
    }

    user.banned = !user.banned;
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
