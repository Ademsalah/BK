module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Notification", {
        type:DataTypes.ENUM("a", "b"),
        title: DataTypes.STRING,
        message: DataTypes.STRING,
        status: DataTypes.ENUM("unread", "read")
    });
};