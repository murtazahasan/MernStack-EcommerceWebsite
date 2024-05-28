// controllers/cart.controller.js
import User from '../models/user.model.js';
import Cart from '../models/cart.model.js';

// Add item to cart
export const addToCart = async (req, res) => {
  const userId = req._id;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
      const user = await User.findById(userId);
      user.cart = cart._id;
      await user.save();
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  const userId = req._id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId);

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;

    await cart.save();
    res.status(200).json({ message: 'Cart updated', cart: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const userId = req._id;
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart: cart.items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  const userId = req._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart.items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
