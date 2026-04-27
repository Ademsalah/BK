module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: DataTypes.STRING,

    email: {
      type: DataTypes.STRING,
      unique: true,
    },

    password: DataTypes.STRING,

    role: {
      type: DataTypes.ENUM("ADMIN", "PARTICIPANT", "PRESTATAIRE"),
      allowNull: false,
    },

    banned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  User.associate = (models) => {
    User.hasOne(models.PrestataireProfile, { foreignKey: "userId" });
    User.hasMany(models.Ticket, { foreignKey: "userId" });
    User.hasMany(models.Event, { foreignKey: "adminId" });
  };

  return User;
};
