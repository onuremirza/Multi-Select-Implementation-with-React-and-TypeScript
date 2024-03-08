module.exports = (sequelize, DataTypes) => {
  const data = sequelize.define("data", {
    dataId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return data;
};
