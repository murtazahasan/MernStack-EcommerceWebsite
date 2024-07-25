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
      .populate(
        "items.productId",
        "name price discountPrice imageUrl description category"
      );

    console.log("Orders fetched successfully:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Edit order
export const editOrder = async (req, res) => {
  console.log("Request received at order.controllers: editOrder");

  const { orderId } = req.params;
  console.log("Received orderId:", orderId);
  const updateData = req.body;
  console.log("Received updateData:", updateData);

  try {
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
    console.log("Order updated successfully:", updatedOrder);
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order" });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  console.log("Request received at order.controllers: deleteOrder");

  const { orderId } = req.params;
  console.log("Received orderId:", orderId);

  try {
    await Order.findByIdAndDelete(orderId);
    console.log("Order deleted successfully");
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};
