const express = require("express");
const router = express.Router();

const controller = require("../controllers/userController");

// PARTICIPANTS
router.get("/participants", controller.getParticipants);
router.get("/participants/:id", controller.getParticipantById);
router.put("/participants/:id", controller.updateParticipant);
router.delete("/participants/:id", controller.deleteParticipant);

// BAN SYSTEM
router.patch("/participants/:id/ban", controller.toggleBan);

module.exports = router;
