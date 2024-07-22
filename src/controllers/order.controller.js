import Order from "../models/order.model.js";
import User from "../models/user.model.js";

const calculateTotalAmount = (items) => {
  return items.reduce(
    (total, item) => total + item.product.discountPrice * item.quantity,
    0
  );
};

// create new orders
export const createOrder = async (req, res) => {
  console.log("Request received at order.controllers: createOrder");
  console.log("Request body:", req.body);
  const { userId, items, shippingAddress, totalAmount } = req.body;


  if (!userId) {
    console.log("No userId provided");
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount,
      createdAt: Date.now(),
    });

    const savedOrder = await newOrder.save();

    const user = await User.findById(userId);
    if (user) {
      user.cart.items = [];
      await user.save();
    }

    console.log("Order created successfully:", savedOrder._id);
    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order" });
  }
};

// Get all orders (for admin panel)
export const getAllOrders = async (req, res) => {
  console.log("Request received at order.controllers: getAllOrders");

  try {
    const orders = await Order.find()
      .populate("userId", "username email")
      .populate("items.product", "name price discountPrice imageUrl");

    console.log("Orders fetched successfully:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};
