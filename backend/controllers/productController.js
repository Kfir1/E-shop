import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js"; // product model (mongoose) 

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});


// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
const getProductsById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    // if product found (by id) then json it
    if (product) {
      return res.json(product);
    } else {
       res.status(404);
       throw new Error('Resource not found');
    }
});


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // use Product model and create fields for sample
  const product = new Product({ 
    name: 'Sample name',
    price: 0,
    user: req.user._id, // logged in user
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}); // route for that funtion in routes productRoutes

export { getProducts, getProductsById, createProduct };