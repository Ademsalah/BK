const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { recommendTeams } = require("../controllers/recommendation.controller");

router.post("/", auth, role("ADMIN"), recommendTeams);

module.exports = router;
