const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user.model")(sequelize, Sequelize);
db.Event = require("./event.model")(sequelize, Sequelize);
db.Budget = require("./budget.model")(sequelize, Sequelize);
db.Expense = require("./expense.model")(sequelize, Sequelize);
db.Service = require("./service.model")(sequelize, Sequelize);
db.Registration = require("./registration.model")(sequelize, Sequelize);
db.Review = require("./review.model")(sequelize, Sequelize);
db.Recommendation = require("./recommendation.model")(sequelize, Sequelize);
db.Notification = require("./notification.model")(sequelize, Sequelize);
db.Admin = require("./admin.model")(sequelize, Sequelize);
db.Organizer = require("./organizer")(sequelize, Sequelize);
db.Prestataires = require("./prestataires.model")(sequelize, Sequelize);
db.Participant = require("./participant.model")(sequelize, Sequelize);

// Organizer → Events
db.User.hasMany(db.Event, { foreignKey: "organizerId" });
db.Event.belongsTo(db.User, { as: "organizer" });

// Event → Budget
db.Event.hasOne(db.Budget);
db.Budget.belongsTo(db.Event);

// Budget → Expense
db.Budget.hasMany(db.Expense);
db.Expense.belongsTo(db.Budget);

// Participant → Event
db.User.belongsToMany(db.Event, { through: db.Registration });
db.Event.belongsToMany(db.User, { through: db.Registration });

// Prestataires → Service
db.User.hasMany(db.Service, { foreignKey: "prestartairesId" });
db.Service.belongsTo(db.User, { as: "prestataires" });

// Event ↔ Service
db.Event.belongsToMany(db.Service, { through: "EventServices" });
db.Service.belongsToMany(db.Event, { through: "EventServices" });

// Reviews
db.User.hasMany(db.Review);
db.Review.belongsTo(db.User);

db.Event.hasMany(db.Review);
db.Review.belongsTo(db.Event);

db.Service.hasMany(db.Review);
db.Review.belongsTo(db.Service);

// Recommendation
db.Event.hasMany(db.Recommendation);
db.Recommendation.belongsTo(db.Event);

db.User.hasMany(db.Recommendation);
db.Recommendation.belongsTo(db.User);

// Notification
db.User.hasMany(db.Notification);
db.Notification.belongsTo(db.User);

// Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
