// routes/userAuth.routes.js
import express from "express";
import {
  signup,
  login,
  logout,
  myDetails,
} from "../controllers/userAuth.controller.js";
import { verifyToken, verifyAdmin } from "../middlewares/auth.middleware.js";

const userAuth = express.Router();

// User authentication routes
userAuth.post("/signup", signup);
userAuth.post("/login", login);
userAuth.post("/logout", logout);

// Protected route to get user details
userAuth.get("/my-details", verifyToken, myDetails);

// Example of an admin-protected route
userAuth.get("/admin-only", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

export default userAuth;
