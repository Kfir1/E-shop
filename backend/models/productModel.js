import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
     },
     rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

// create database structure (fields) (noSql - no relational database)
// every product needs to be connected to a user - need relation
const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
       type: String,
       required: true,
    },
    image: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    }, 
}, {
    timestamps: true,
});

//  save the model(name of variable, mongoose schema created) into variable
const Product = mongoose.model("Product", productSchema);

export default Product;