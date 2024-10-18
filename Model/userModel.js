const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../Config/database");

const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,

    phoneNumber: {
      type: DataTypes.INTEGER,
    },
    address: {
      type: DataTypes.STRING,
    },
  },
  role: {
    type: DataTypes.ENUM("customer", "admin", "supplier"),
    defaultValue: "customer",
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
    // unique: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiration: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
