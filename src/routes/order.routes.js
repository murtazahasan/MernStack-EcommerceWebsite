import express from "express";
const router = express.Router();
import {
  createOrder,
  getAllOrders,
  editOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

router.post("/new-order", verifyToken, createOrder);
router.get("/all", verifyToken, verifyAdmin, getAllOrders);
router.put("/edit/:orderId", verifyToken, verifyAdmin, editOrder);
router.delete("/delete/:orderId", verifyToken, verifyAdmin, deleteOrder);

export default router;
