import express from "express";
import {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
  searchProducts, 
} from "../controllers/product.controller.js";

const router = express.Router();
// searching functionality for admin page
router.get("/", getAllProducts);
// searching functionality for frontend ui/ux
router.get("/search", searchProducts);

router.get("/:id", getProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);



export default router;
