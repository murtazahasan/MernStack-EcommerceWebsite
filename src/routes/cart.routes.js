// routes/cart.routes.js
import express from "express";
import {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCart,
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.put("/update", verifyToken, updateCartItem);
router.delete("/remove", verifyToken, removeFromCart);
router.get("/", verifyToken, getCart);

export default router;
