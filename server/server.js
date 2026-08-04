const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenv.config();

const app = express();
const db = require("./models");

// Middlewares
app.use(express.json());

app.use(
  cors({
    origin: "https://bkeventad.netlify.app",
    credentials: true,
  })
);

// Routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/events", require("./routes/event.routes"));
app.use("/tickets", require("./routes/ticket.routes"));
app.use("/recommend", require("./routes/recommendation.routes"));
app.use("/event-prestataires", require("./routes/eventPrestataire.routes"));
app.use("/prestataires", require("./routes/prestataire.routes"));
app.use("/participants", require("./routes/userRoutes"));
app.use("/update", require("./routes/update.route"));

// Database + server
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:");
    console.error(error);
  });