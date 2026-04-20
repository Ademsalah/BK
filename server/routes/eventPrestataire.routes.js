const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  assign,
  updateStatus,
} = require("../controllers/eventPrestataire.controller");

// ADMIN assigns prestataire to event
router.post("/assign", auth, role("ADMIN"), assign);

// PRESTATAIRE accepts/refuses
router.put("/status/:id", auth, role("PRESTATAIRE"), updateStatus);

module.exports = router;
