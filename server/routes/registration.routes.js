// routes/registration.routes.js
const express = require("express");
const router = express.Router();

const { joinEvent } = require("../controllers/registration.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/join", verifyToken, joinEvent);

module.exports = router;
