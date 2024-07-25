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
  const { userId, items, shippingAddress, totalAmount } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    // Step 1: Check stock for all items first
    const productIds = items.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    for (const item of items) {
      const product = products.find((prod) => prod._id.equals(item.productId));
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found for ID ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.name}. Please adjust your order.`,
        });
      }
    }

    // Step 2: Update stock levels with optimistic locking
    const updatePromises = [];
    for (const item of items) {
      const product = products.find((prod) => prod._id.equals(item.productId));
      const currentVersion = product.version; // Store current version

      product.stock -= item.quantity;
      product.version++; // Increment version before saving

      updatePromises.push(product.save()); // Save with version comparison
    }

    await Promise.all(updatePromises); // Wait for all updates to complete

    // Step 3: Create new order
    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount,
      createdAt: Date.now(),
    });

    const savedOrder = await newOrder.save();

    // Step 4: Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cart.items = [];
      await user.save();
    }

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    // Handle errors, including conflicts caused by version mismatch
    if (error.name === "MongoError" && error.code === 11000) {
      // Handle potential version mismatch
      res
        .status(409)
        .json({ message: "Conflict during order creation. Please try again." });
    } else {
      res
        .status(500)
        .json({ message: "Error creating order", error: error.message });
    }
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
