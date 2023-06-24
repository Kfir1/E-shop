import express from 'express';
// could use common.js syntax instead of module 
// (import express from 'express';) and write
// const express = require('express');
// need to change type in root package.json (type: commonjs)
import dotenv from 'dotenv';
dotenv.config(); // needs to be below (import dotenv from 'dotenv';)
import productRoutes from './routes/productRoutes.js'
import connectDB from './config/db.js';


// create variable for port
// frontend server runs on port 3000 
// backend will run on port 5000
// added enviroment variables on file .env
// default port number will be PORT
const port = process.env.PORT || 5000;

connectDB(); // connect to MongoDB

// initialize express
const app = express();

// create first route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// every time this route is running '/api/products', will use (productRoutes) file
app.use('/api/products', productRoutes);

// start the server
app.listen(port, () => console.log(`Server running on port ${port}`));