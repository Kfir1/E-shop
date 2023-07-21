import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
//import Product from "../models/orderModel.js"; // product model (mongoose) 

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    // check if there is orderItems array but is empty length 0
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else { // else create new order array
        const order = new Order({ // this will store the order object on order variable, but will not save it yet - need to save it below
            orderItems: orderItems.map((x) => ({ // map through orderItems to set product to _id because it will not come from the frontend
                ...x, // x will be name, qty, image, price from orderModel
                product: x._id, // need just product id, but there is no _id field product object orderModel, so product will be _id
                _id: undefined // no _id field, so setting it to undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createdOrder = await order.save(); // save the new created order
        
        res.status(201).json(createdOrder); // respond with 201 and pass the createdOrder 
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }); // find and match the user that is logged in (by _id)
    res.status(200).json(orders);
});

// @desc    Get order by ID
// @route   GET /api/order/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    // find order by id and pass it in URL :id (dynamic id).
    // to add user, name, email to the order - populate() - because it is not stored in user collection
    const order = await Order.findById(req.params.id).populate('user','name email'); 
    
    // check if order exist
    if (order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    res.send('update order to paid');
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.send('update order to delivered');
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    res.send('get all orders');
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
};


//orderItems: [ // array of objects,
// user can have an array of ordered items
//    name: { type: String, required: true },
//     qty: { type: Number, required: true },
//     Image: { type: String, required: true },
//     price: { type: Number, required: true },
//     product: { 
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: "Product",

/// need to add:

//product: { 
    //         type: mongoose.Schema.Types.ObjectId,
    //         required: true,
    //         ref: "Product",

    // do it by product: x._id

// ...x will be all the below - from orderModel 
//    name: { type: String, required: true },
//     qty: { type: Number, required: true },
//     Image: { type: String, required: true },
//     price: { type: Number, required: true },