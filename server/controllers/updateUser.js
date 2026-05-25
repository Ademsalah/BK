const db = require("../models");
const User = db.User;
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

// generate 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();

    // save OTP in DB
    user.otpCode = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email, // ✅ ALWAYS use DB email
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It expires in 5 minutes.`,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ message: "Error sending OTP" });
  }
};

exports.verifyOtpAndUpdate = async (req, res) => {
  try {
    const { userId, otp, data } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // normalize OTP (IMPORTANT FIX)
    const incomingOtp = String(otp);
    const savedOtp = String(user.otpCode);

    if (savedOtp !== incomingOtp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ONLY UPDATE NAME
    user.name = data.name;

    // OPTIONAL PASSWORD UPDATE
    if (data.password && data.password.trim() !== "") {
      user.password = await bcrypt.hash(data.password, 10);
    }

    // CLEAR OTP
    user.otpCode = null;
    user.otpExpires = null;

    await user.save();

    return res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};