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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // get the data from the body - destructure the data needed from body
  const {
     name,
     price,
     description,
     image,
     brand,
     category,
     countInStock,
    } = req.body;

    // find the product to update by id
    const product = await Product.findById(req.params.id);

    // if product exist then update the fields coming from the form
    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else { // if product not found then throw error
      res.status(404);
      throw new Error('Resource not found');
    }
}); // a route for updateProduct is created on productRoutes

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    // find the product to update by id
    const product = await Product.findById(req.params.id);

    // if product exist then update the fields coming from the form
    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.status(200).json({ message: 'Product deleted' })
    } else { // if product not found then throw error
      res.status(404);
      throw new Error('Resource not found');
    }
}); // a route for updateProduct is created on productRoutes


export {
   getProducts,
   getProductsById,
   createProduct,
   updateProduct,
   deleteProduct,
};