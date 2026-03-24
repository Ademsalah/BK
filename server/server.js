// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const db = require("./models");
// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require("./routes/event.routes");
const authRoutes = require("./routes/auth.routes");
const registrationRoutes = require("./routes/registration.routes");
const notifRoutes = require("./routes/notification.routes");

// Routes
app.use("/api/auth", authRoutes); // ✅ auth first
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notifRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB + Server start
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synced");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Error:", err);
  });

module.exports = app;
