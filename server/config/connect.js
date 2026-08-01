const sequelize = require("./config/database");

sequelize
    .authenticate()
    .then(function () {
        console.log("MySQL connected successfully");
    })
    .catch(function (error) {
        console.log("Database connection failed:", error);
    });