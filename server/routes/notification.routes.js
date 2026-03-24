// routes/notification.routes.js
const express = require("express");
const router = express.Router();

const notifController = require("../controllers/notification.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", verifyToken, notifController.getMyNotifications);
router.put("/:id/read", verifyToken, notifController.markAsRead);

module.exports = router;
