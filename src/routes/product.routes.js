// product.routes.js
import express from 'express';
import { getAllProducts, getProductById, addProduct, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Get product by ID
router.get('/:id', getProductById);

// Add a new product
router.post('/', addProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

export default router;
