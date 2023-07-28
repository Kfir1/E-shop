import express from "express";
const router = express.Router();
import { 
    getProducts,
    getProductsById,
    createProduct,
 } from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

// for all products
router.route('/').get(getProducts).post(protect, admin, createProduct);

// for single product 
router.route('/:id').get(getProductsById);

export default router;