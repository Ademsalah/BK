const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  assign,
  updateStatus,
  getEventsByPrestataire,
} = require("../controllers/eventPrestataire.controller");

router.get("/:id", getEventsByPrestataire);

// ADMIN assigns prestataire to event
router.post("/assign", auth, role("ADMIN"), assign);

// PRESTATAIRE accepts/refuses
router.put("/status/:id", updateStatus);

module.exports = router;
