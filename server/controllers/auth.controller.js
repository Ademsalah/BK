const bcrypt = require("bcrypt");
const db = require("../models");
const { generateToken } = require("../utils/jwt");
const { sendWelcomeEmail } = require("../utils/mailer");

const User = db.User;

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // CHECK IF EMAIL EXISTS
    const exists = await User.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // HASH PASSWORD
    const hashed = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "PARTICIPANT",
    });

    // SEND WELCOME EMAIL
    await sendWelcomeEmail(email, name);

    // RESPONSE
    res.json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ===============================
// LOGIN
// ===============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CHECK PASSWORD
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    // GENERATE TOKEN
    const token = generateToken(user);

    // RESPONSE
    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};
