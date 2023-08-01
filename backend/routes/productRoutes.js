import express from "express";
const router = express.Router();
import { 
    getProducts,
    getProductsById,
    createProduct,
    updateProduct,  // mutation created on productApiSlice on front end
    deleteProduct,
    createProductReview,
    getTopProducts,
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js';

// for all products
router.route('/').get(getProducts).post(protect, admin, createProduct);

// get top products
// needs to be above '/:id' route otherwise it will look for the word top as an id
// middleware not needed, cause it is not protected
// need to create query on productSlice on frontend
router.get('/top', getTopProducts); 

// for single product 
router.
    route('/:id')
    .get(getProductsById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

export default router;