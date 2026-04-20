const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// MODELS
db.User = require("./user")(sequelize, DataTypes);
db.Event = require("./event")(sequelize, DataTypes);
db.Prestataire = require("./PrestataireProfile")(sequelize, DataTypes);
db.Ticket = require("./ticket")(sequelize, DataTypes);
db.EventPrestataire = require("./eventPrestataire")(sequelize, DataTypes);

// RELATIONS
db.User.hasMany(db.Event, { foreignKey: "adminId" });

db.User.hasOne(db.Prestataire, { foreignKey: "userId" });

db.User.hasMany(db.Ticket, { foreignKey: "userId" });
db.Event.hasMany(db.Ticket, { foreignKey: "eventId" });

db.Event.hasMany(db.EventPrestataire, { foreignKey: "eventId" });
db.Prestataire.hasMany(db.EventPrestataire, { foreignKey: "prestataireId" });

module.exports = db;
