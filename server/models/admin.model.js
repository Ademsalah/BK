module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define("Admin", {
    permissions: DataTypes.STRING,
  });

  Admin.associate = (models) => {
    Admin.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Admin;
};
