const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const {
  recommendTeams,
  getReplacementCandidates,
  replacePrestataire,
} = require("../controllers/recommendation.controller");

router.post("/", auth, role("ADMIN"), recommendTeams);
router.post("/replacement-candidates", getReplacementCandidates);

// 👉 replace prestataire
router.post("/replace-prestataire", replacePrestataire);

module.exports = router;
