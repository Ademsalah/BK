const router = require("express").Router();

const {
  createPrestataire,
  getAllPrestataires,
  getPrestataireByUserId,
  deletePrestataire,
  toggleBan,
} = require("../controllers/prestataire.controller");

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

// router.post("/create-prestataire", auth, role("ADMIN"), createPrestataire);

router.post("/create-prestataire", createPrestataire);

router.get("/", getAllPrestataires);
router.get("/:id", getPrestataireByUserId);
router.delete("/:id", deletePrestataire);
router.patch("/:id/ban", toggleBan);
module.exports = router;
