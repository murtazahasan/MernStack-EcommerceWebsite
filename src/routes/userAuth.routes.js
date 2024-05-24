import express from "express";
import {
  signup,
  login,
  logout,
  myDetails,
} from "../controllers/userAuth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const userAuth = express.Router();

// User authentication routes
userAuth.post("/signup", signup);
userAuth.post("/login", login);
userAuth.post("/logout", logout);

// Protected route to get user details
userAuth.get("/my-details", verifyToken, myDetails);

export default userAuth;
