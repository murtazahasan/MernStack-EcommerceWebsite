// controllers/cart.controller.js
import User from "../models/user.model.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  console.log("Request received at addToCart");
  const userId = req._id;
  const { productId, quantity } = req.body;

  console.log("User ID:", userId);
  console.log("Product ID:", productId);
  console.log("Quantity:", quantity);

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Product ID and quantity are required" });
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    let cart = await Cart.findOne({ user: userId }).session(session);
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save({ session });
      await User.findByIdAndUpdate(userId, { cart: cart._id }, { session });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Item added to cart", cart: cart.items });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  const userId = req._id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  const userId = req._id;
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    res
      .status(200)
      .json({ message: "Item removed from cart", cart: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCart = async (req, res) => {
  const userId = req._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
