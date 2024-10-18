const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/database");

const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.STRING,
  },
  supplierId: { type: DataTypes.INTEGER },
});

module.exports = Product;
