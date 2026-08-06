const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./models");

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "https://bkeventad.netlify.app",
  "http://localhost:3000",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🌍 Request Origin:", origin);

    // Allow requests without an origin
    // (Postman, curl, server-to-server, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
};

// =====================================================
// MIDDLEWARE
// =====================================================

// IMPORTANT: CORS MUST BE BEFORE ROUTES
app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// =====================================================
// HEALTH
// =====================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running",
  });
});

// =====================================================
// ROUTES
// =====================================================

app.use("/auth", require("./routes/auth.routes"));
app.use("/events", require("./routes/event.routes"));
app.use("/tickets", require("./routes/ticket.routes"));
app.use("/recommend", require("./routes/recommendation.routes"));
app.use(
  "/event-prestataires",
  require("./routes/eventPrestataire.routes")
);
app.use("/prestataires", require("./routes/prestataire.routes"));
app.use("/participants", require("./routes/userRoutes"));
app.use("/update", require("./routes/update.route"));

// =====================================================
// DATABASE + SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:");
    console.error(error);
  });