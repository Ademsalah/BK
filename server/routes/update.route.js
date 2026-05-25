const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtpAndUpdate } = require("../controllers/updateUser.js");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndUpdate);

module.exports = router;
