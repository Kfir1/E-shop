import express from 'express';
// could use common.js syntax instead of module 
// (import express from 'express';) and write
// const express = require('express');
// need to change type in root package.json (type: commonjs)
import dotenv from 'dotenv';
dotenv.config(); // needs to be below (import dotenv from 'dotenv';)
import products from './data/products.js';
// since ES modules on backend, have to use 
// (products.js) and just products for my own javascript modules
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

// create route to see data from products.js json file
app.get('/api/products', (req, res) => {
    res.json(products);
});

// create a route for a single product
// iterate over the prodcuts array of objects
// if the product _id matches the product in the URL,
// then return that product (res.json(products))
app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => p._id === req.params.id);
    res.json(product);
});

// start the server
app.listen(port, () => console.log(`Server running on port ${port}`));