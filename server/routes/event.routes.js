const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
  createEvent,
  getEvents,
  getEventById,
} = require("../controllers/event.controller");

router.get("/", getEvents);
router.post("/", auth, role("ADMIN"), createEvent);
router.get("/:id", getEventById);

module.exports = router;
