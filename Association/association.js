const cart = require("../Model/cartModel");
const Product = require("../Model/productModel");
const User = require("../Model/userModel");
const cartItem = require("../Model/cartItems");
const OrderItem = require("../Model/orderItem");
const Order = require("../Model/orderModel");
const cartItems = require("../Model/cartItems");
const supplierRequest = require("../Model/supplierRequest");

const Association = async (req, res) => {
  User.hasOne(cart, { foreignKey: "userId" });

  supplierRequest.belongsTo(User, { foreignKey: "userId" });

  Product.hasMany(cartItem, { foreignKey: "productId" });

  Order.hasMany(OrderItem, { foreignKey: "orderId" });
  OrderItem.belongsTo(Order, { foreignKey: "orderId" });

  OrderItem.belongsTo(Product, { foreignKey: "productId" });
  Product.hasMany(OrderItem, { foreignKey: "productId" });

  cart.belongsTo(User, { foreignKey: "userId" });

  cartItems.belongsTo(cart, { foreignKey: "cartId" });
  cartItems.belongsTo(Product, { foreignKey: "productId" });
};

module.exports = Association;
