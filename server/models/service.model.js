module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Service", {
    name: DataTypes.STRING,
    tarif: DataTypes.FLOAT,
    description: DataTypes.STRING,
    unite: DataTypes.STRING,
    disponibility: DataTypes.BOOLEAN,
  });
};
