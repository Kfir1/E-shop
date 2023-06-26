import express from "express";
const router = express.Router();
import { getProducts, getProductsById } from "../controllers/productController.js";

// for all products
router.route('/').get(getProducts);

// for single product 
router.route('/:id').get(getProductsById);

export default router;