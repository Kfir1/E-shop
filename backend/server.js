import express from 'express';
// could use common.js syntax instead of module 
// (import express from 'express';) and write
// const express = require('express');
// need to change type in root package.json (type: commonjs)
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config(); // needs to be below (import dotenv from 'dotenv';)
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';


// create variable for port
// frontend server runs on port 3000 
// backend will run on port 5000
// added enviroment variables on file .env
// default port number will be PORT
const port = process.env.PORT || 5000;

connectDB(); // connect to MongoDB

// initialize express
const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

// create first route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// every time this route is running '/api/products', will use (productRoutes) file
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// create a route for paypal to get PAYPAL_CLIENT_ID from env file
// for security reasons 
app.get('/api/config/paypal', (req, res) => 
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(port, () => console.log(`Server running on port ${port}`));