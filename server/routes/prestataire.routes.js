const router = require("express").Router();

const { createPrestataire } = require("../controllers/prestataire.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/create-prestataire", auth, role("ADMIN"), createPrestataire);

module.exports = router;
