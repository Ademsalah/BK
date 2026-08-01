const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    dialect: "mysql",
    logging: false,
  }
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