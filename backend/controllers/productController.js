import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js"; // product model (mongoose) 

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    // get page number from the URL or 1 if not exist
    // req.query to get the info (query param) about page.
    // pageNumber is arbitrary name 
    // casting to a Number()
    const page = Number(req.query.pageNumber) || 1;

    // use regex to match keyword anywhere in the name of product
    // for example iphone 10 is a product and I typed iphone - still want a match
    // $options: 'i' make it case insensitive
    // : {}  empty object cause keyword does not exist
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' }} : {};

    // get total number of pages with mongoose method countDocuments()
    // this method acts on models. in this case on Product Model
    // implement keyword in count. if keyword exist - will limit the count
    // so, pass in keyword object
    const count = await Product.countDocuments({...keyword});


    // gets all products {empty object} by id 
    // limit the number of pages
    // skip() - skip pages - if 3 then skip 1 and 2 for example
    // pass keyword object instead of all product with {} empty array 
    // to find products with the specific keyword 
    const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page - 1));
    // passing object with the products, page and pages
    res.json({products, page, pages: Math.ceil(count / pageSize)});
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

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
 // get rating and comment for the reviewSchema on productModel
 // user id and name will be accessed through user
 const { rating, comment } = req.body;

  // find the product to update by id
  const product = await Product.findById(req.params.id);
  
  // if product exist then check if it is already was reviewed by specific user
  // one user can make one review per product
  if (product) {
    // product.reviews - productModel has reviewSchema which reviews is inside of it
    const alreadyReviewed = product.reviews.find((review) => 
      review.user.toString() === req.user._id.toString()
    );
  
  
  if (alreadyReviewed) { // if product not found then throw error
    res.status(404);
    throw new Error('Product already reviewed');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating), // make sure it is a number
    comment: comment,
  }

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  // accumulate all reviews and dividing it by length of reviews to get average 
  product.rating = product.reviews.reduce((acc, reviewItem) => acc + reviewItem.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: 'Review added' });
} else {
  res.status(404);
  throw new Error('Product not found');
}
}); 


// @desc    GET a top rated product
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  // get all products findById({}) - by passing {empty object}
  // sort it by rating and limit to 3 products - get top 3
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  
  res.status(200).json(products);
  });


export {
   getProducts,
   getProductsById,
   createProduct,
   updateProduct,
   deleteProduct,
   createProductReview, // added route - in productRoutes
   getTopProducts, // added route - in productRoutes,  need to create query on productSlice on frontend
};