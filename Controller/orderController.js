const Order = require("../Model/orderModel");
const OrderItem = require("../Model/orderItem");
const cart = require("../Model/cartModel");
const cartItems = require("../Model/cartItems");
const Product = require("../Model/productModel");
const User = require("../Model/userModel");

// Place an order (move items from cart to order)
const placeOrder = async (req, res) => {
  try {
    // Find the user's cart
    const cart = await cart.findOne({
      where: { userId: req.user.id, status: "active" },
      include: [{ model: cartItems, include: [Product] }],
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total price
    const total = cart.cartItems.reduce(
      (sum, item) => sum + item.Product.price * item.quantity,
      0
    );

    // Create an order
    const order = await Order.create({
      userId: req.user.id,
      total: total,
      status: "processing", // Default status when an order is created
    });

    // Create order items
    const orderItems = cart.cartItems.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
    }));
    await OrderItem.bulkCreate(orderItems);

    // Clear the cart (or set its status to completed)
    await cart.update({ status: "completed" }, { where: { id: cart.id } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// Get all orders for the logged-in user (customer)
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, include: [Product] }],
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get all orders (admin view)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [Product] }, { model: User }],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["processing", "shipped", "delivered", "canceled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.update({ status: status });

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus };
