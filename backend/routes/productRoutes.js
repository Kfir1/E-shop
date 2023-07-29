import express from "express";
const router = express.Router();
import { 
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,  // mutation created on productApiSlice on front end
    deleteProduct,
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

// for all products
router.route('/').get(getProducts).post(protect, admin, createProduct);

// for single product 
router.route('/:id').get(getProductsById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;