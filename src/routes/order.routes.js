import express from "express";
const router = express.Router();
import { createOrder, getAllOrders } from "../controllers/order.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

// Create new order (requires authentication)
router.post("/new-order", verifyToken, createOrder);

// Get all orders (for admin panel, requires authentication)
router.get("/all", verifyToken, verifyAdmin, getAllOrders);

export default router;
