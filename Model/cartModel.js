const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/database");
const User = require("./userModel");

const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  status: {
    type: DataTypes.ENUM("active", "completed"),
    defaultValue: "active",
  },
});

module.exports = Cart;
