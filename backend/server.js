import path from 'path'; // good convention to import at the top
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
import uploadRoutes from './routes/uploadRoutes.js';
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

// every time this route is running '/api/products', will use (productRoutes) file
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// create a route for paypal to get PAYPAL_CLIENT_ID from env file
// for security reasons 
app.get('/api/config/paypal', (req, res) => 
    res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

const __dirname = path.resolve(); // set __dirname to current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
//use(argument1 = file path, argument2 = static directory path, path of the folder)

if (process.env.NODE_ENV === 'production') {  // check if in production eviroment
    // set static folder (react built folder)
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    // any route that is not the routes above, api will be redirected to index.html
    // elaboration: load the index.html that is in frontend build folder which has been made static (lines above) if in production
    // these routes: app.use('/api/products', productRoutes);
    // app.use('/api/users', userRoutes);
    // app.use('/api/orders', orderRoutes);
    // app.use('/api/upload', uploadRoutes);
    app.get('*', (req, res) => 
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    ); 
} else {  // if not in production enviroment - use react dev server
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

app.use(notFound);
app.use(errorHandler);

// start the server
app.listen(port, () => console.log(`Server running on port ${port}`));


// in the context of a Node.js application, the code express.static(path.join(__dirname, '/uploads')) sets up a static file server using the Express framework. This is typically used to serve static files (like images, CSS, JavaScript files, etc.) to the client (web browser) from a specific directory on the server.
// Let's break down the code:
// express: This refers to the Express framework, which is a popular web application framework for Node.js. It simplifies the process of building web applications and APIs.
// static: express.static is a built-in middleware function in Express that serves static files. It takes the directory path as an argument from which to serve the files.
// path: This is a built-in Node.js module that provides utilities for working with file and directory paths.
// __dirname: This is a special Node.js variable that represents the current directory of the script. It contains the absolute path to the directory where the currently executing script resides.
// '/uploads': This is the directory name that is being appended to the current directory using path.join. In this case, it is '/uploads', which means the server will serve static files from the 'uploads' directory within the current directory.
// So, when you use express.static(path.join(__dirname, '/uploads')), you are telling Express to serve static files located in the 'uploads' directory relative to the current directory of the script.
// For example, if the script is running from /home/user/myapp/server.js, and you have a file /home/user/myapp/uploads/image.jpg, then you can access that image from the client side (browser) by using a URL like http://yourdomain.com/image.jpg, and Express will serve the file from the 'uploads' directory on the server.