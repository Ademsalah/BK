require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/events", require("./routes/event.routes"));
app.use("/tickets", require("./routes/ticket.routes"));
// app.use("/prestataires", require("./routes/prestataire.routes"));
app.use("/recommend", require("./routes/recommendation.routes"));
app.use("/event-prestataires", require("./routes/eventPrestataire.routes"));
app.use("/prestataires", require("./routes/prestataire.routes"));

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Server running");
  });
});
