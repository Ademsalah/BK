const db = require("../models");
const bcrypt = require("bcrypt");
const { sendPrestataireEmail } = require("../utils/mailer");

const User = db.User;
const Prestataire = db.Prestataire;
function generateTempPassword() {
  return Math.random().toString(36).slice(-8);
}

exports.createPrestataire = async (req, res) => {
  try {
    const {
      name,
      email,
      category,
      priceMin,
      priceMax,
      location,
      description,
      rating,
    } = req.body;

    // ✅ temp password
    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    // 1. Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "PRESTATAIRE",
      mustChangePassword: true,
    });

    // 2. Create profile
    const profile = await Prestataire.create({
      userId: user.id,
      category,
      priceMin,
      priceMax,
      rating,
      location,
      description,
    });

    // 📧 3. Send Email
    await sendPrestataireEmail(email, name, tempPassword);

    res.json({
      message: "Prestataire created & email sent ✅",
      user,
      profile,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPrestataires = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "PRESTATAIRE" },
      attributes: ["id", "name", "email", "createdAt"], // 🔥 remove password
    });

    const result = await Promise.all(
      users.map(async (user) => {
        const profile = await Prestataire.findOne({
          where: { userId: user.id },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,

          // flatten profile
          category: profile?.category,
          priceMin: profile?.priceMin,
          priceMax: profile?.priceMax,
          rating: profile?.rating,
          location: profile?.location,
          description: profile?.description,
        };
      }),
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getPrestataireByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "createdAt"],
    });

    if (!user || user.role !== "PRESTATAIRE") {
      return res.status(404).json({ message: "Prestataire not found" });
    }

    const profile = await Prestataire.findOne({
      where: { userId: user.id },
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,

      category: profile?.category,
      priceMin: profile?.priceMin,
      priceMax: profile?.priceMax,
      rating: profile?.rating,
      location: profile?.location,
      description: profile?.description,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updatePrestataire = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      email,
      category,
      priceMin,
      priceMax,
      location,
      description,
      rating,
    } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
    });

    // update profile
    const profile = await Prestataire.findOne({
      where: { userId: user.id },
    });

    if (profile) {
      await profile.update({
        category,
        priceMin,
        priceMax,
        location,
        description,
        rating,
      });
    }

    res.json({
      message: "Prestataire updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePrestataire = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // delete profile first
    await Prestataire.destroy({
      where: { userId: user.id },
    });

    // delete user
    await user.destroy();

    res.json({
      message: "Prestataire deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
