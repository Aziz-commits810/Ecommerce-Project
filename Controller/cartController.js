const cartItems = require("../Model/cartItems");
const Product = require("../Model/productModel");
const Cart = require("../Model/cartModel");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({
      where: { userId: req.user.id, status: "active" },
    });
    if (!cart) {
      cart = await cart.create({ userId: req.user.id, status: "active" });
    }

    // Check if product already exists in the cart
    let cartItem = await cartItems.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (cartItem) {
      // Update quantity if product is already in the cart
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Add new product to cart
      cartItem = await cartItems.create({
        cartId: cart.id,
        productId: productId,
        quantity,
      });
    }

    res.status(201).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add product to cart" });
  }
};

// Get all cart items
const getCartItems = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: "active" },
      include: [{ model: cartItems, include: [Product] }],
    });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.status(200).json(cart.cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: "active" },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await cartItems.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await cartItem.destroy();

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove product from cart" });
  }
};

// Update cart item quantity
const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      where: { userId: req.user.id, status: "active" },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = await cartItems.findOne({
      where: { cartId: cart.id, productId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};
module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
};
