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
db.PrestataireProfile = require("./PrestataireProfile")(sequelize, DataTypes);
db.Event = require("./event")(sequelize, DataTypes);
db.Ticket = require("./ticket")(sequelize, DataTypes);
db.EventPrestataire = require("./eventPrestataire")(sequelize, DataTypes);


Object.keys(db).forEach((model) => {
  if (db[model].associate) {
    db[model].associate(db);
  }
});

module.exports = db;
