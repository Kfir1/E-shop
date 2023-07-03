import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// protect routes
// next moves on to the next middleware
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // read the JWT from cookie
    // .jwt is the name chosen from userController res.cookie 
    // get what in request
    token = req.cookies.jwt;

    // check if token exist
    if (token) {
        // extract user id from token
        try {
            // decode the token jwt.verify(token , and secret from env file)
            // decoded will be an object that has a userId field
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // use the User model and find user by the decoded user id
            // even though the password is hashed I dont want to get it, so -password
            // req.user - this user object will be on the request object in all of the routes (look in userController routes) 
            req.user = await User.findById(decoded.userId).select('-password');
            next(); // move to the next piece of middleware
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
        } else {
            res.status(401);
            throw new Error('Not authorized, no token');
        };
});



// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) { // check if in req object user exist && if he is an admin
        next(); // if true, move to next middleware
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};

export { protect, admin };