const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/database");

const supplierRequest = sequelize.define("supplierRequest", {
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

module.exports = supplierRequest;
