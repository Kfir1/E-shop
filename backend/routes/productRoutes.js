import express from "express";
const router = express.Router();
// import products from '../data/products.js';   // just for bringing data from file products.js
// // since ES modules on backend, have to use 
// // (products.js) and just products for my own javascript modules
import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js"; // product model (mongoose) 

// full URL path brought from server.js file
router.get('/', asyncHandler (async (req, res) => {
    // Product({empty object}) - to get all of the products
    const products = await Product.find({});
    res.json(products);
}));

// create a route for a single product
// Product json will be found according to id from URL
// if the product _id matches the product in the URL,
// then return that product (res.json(product))
router.get('/:id', asyncHandler (async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    // if product found (by id) then json it
    if (product) {
      return res.json(product);
    }

    res.status(404).json({ message: 'Product not found' })

}));


export default router;