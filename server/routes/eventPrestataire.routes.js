const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

const {
  assign,
  updateStatus,
  getEventsByPrestataire,
  getPrestataireDetails,
} = require("../controllers/eventPrestataire.controller");

router.post("/assign", auth, role("ADMIN"), assign);

// ADMIN assigns prestataire to event

// PRESTATAIRE accepts/refuses
router.put("/status/:id", updateStatus);

router.get("/Epresta/:id", getPrestataireDetails);
router.get("/:id", getEventsByPrestataire);
module.exports = router;
