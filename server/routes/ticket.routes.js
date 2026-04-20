const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const { bookTicket } = require("../controllers/ticket.controller");

router.post("/", auth, bookTicket);

module.exports = router;
