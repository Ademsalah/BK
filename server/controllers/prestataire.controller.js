const db = require("../models");
const bcrypt = require("bcrypt");

const User = db.User;
const Prestataire = db.Prestataire;

exports.createPrestataire = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      category,
      priceMin,
      priceMax,
      location,
      description,
      rating,
    } = req.body;

    // 1. Create USER (prestataire)
    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "PRESTATAIRE",
    });

    // 2. Create PROFILE linked to that user
    const profile = await Prestataire.create({
      userId: user.id, 
      category,
      priceMin,
      priceMax,
      rating,
      location,
      description,
    });

    res.json({
      message: "Prestataire created successfully",
      user,
      profile,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
