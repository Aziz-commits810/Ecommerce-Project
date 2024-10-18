const express = require("express");
const router = express.Router();
const cartController = require("../Controller/cartController");
const authMiddleware = require("../Middleware/authMiddleware");

// Add product to cart (Customer)
router.post("/addtocart", authMiddleware, cartController.addToCart);

// Get all cart items (Customer)
router.get("/cartitems", authMiddleware, cartController.getCartItems);

// Remove product from cart (Customer)
router.delete(
  "/removefromcart/:productId",
  authMiddleware,
  cartController.removeFromCart
);

// Update cart item quantity (Customer)
router.patch(
  "/updatecartitem/:productId",
  authMiddleware,
  cartController.updateCartItemQuantity
);

module.exports = router;
