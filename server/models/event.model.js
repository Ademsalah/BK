module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Event", {
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    description: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    status: DataTypes.ENUM("draft", "published", "closed"),
    image: DataTypes.STRING,
  });
};
