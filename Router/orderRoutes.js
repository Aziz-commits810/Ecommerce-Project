const express = require("express");
const router = express.Router();
const orderController = require("../Controller/orderController");
const authMiddleware = require("../Middleware/authMiddleware");
const roleMiddleware = require("../Middleware/roleMiddleware");

// Customer routes
router.post("/placeOrder", authMiddleware, orderController.placeOrder); // Place an order
router.get("/myOrders", authMiddleware, orderController.getUserOrders); // Get user's orders

// Admin routes
router.get(
  "/allOrders",
  authMiddleware,
  roleMiddleware,
  orderController.getAllOrders
); // Admin: Get all orders
router.patch(
  "/:id/updateStatus",
  authMiddleware,
  roleMiddleware,
  orderController.updateOrderStatus
); // Admin: Update order status

module.exports = router;
