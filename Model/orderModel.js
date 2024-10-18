const { DataTypes } = require("sequelize");
const { sequelize } = require("../Config/database");

const Order = sequelize.define("Order", {
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "canceled"),
    defaultValue: "pending",
    allowNull: false,
  },
});

module.exports = Order;
