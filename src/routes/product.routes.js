import express from 'express';
import { getAllProducts, addProduct, deleteProduct } from '../controllers/product.controller.js';

const router = express.Router();

// Get all products
router.get('/', getAllProducts);

// Add a new product
router.post('/', addProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

export default router;
