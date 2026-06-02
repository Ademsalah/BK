const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const upload = require("../middleware/upload");

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");

router.get("/", getEvents);
router.post("/", auth, role("ADMIN"), upload.array("photos", 10), createEvent);

router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
module.exports = router;
