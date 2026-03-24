// routes/event.routes.js
const express = require("express");
const router = express.Router();

const eventController = require("../controllers/event.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/role.middleware");

// CREATE
router.post(
  "/",
  verifyToken,
  allowRoles("organizer,Admin"),
  eventController.createEvent,
);

// READ
router.get("/", verifyToken, eventController.getAllEvents);
router.get("/:id", verifyToken, eventController.getEventById);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  allowRoles("organizer,Admin"),
  eventController.updateEvent,
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  allowRoles("organizer,Admin"),
  eventController.deleteEvent,
);

module.exports = router;
