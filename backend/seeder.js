// script to seed all the data (users and products)

import mongoose from "mongoose";
import dotenv from "dotenv";
import color from "colors";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

// initialize variables to connect to database
// Loads environment variables from .env file into `process.env`
dotenv.config();

// connect to the database of MongoDB 
connectDB();

// fuction to import data
const  importData = async () => {
    try {
      await Order.deleteMany();
      await Product.deleteMany();
      await User.deleteMany();

      const createdUsers = await User.insertMany(users);

      const adminUser = createdUsers[0]._id;

      const sampleProducts = products.map((product) => {
        return { ...product,
                 user: adminUser 
               };
      });

      await Product.insertMany(sampleProducts);

      console.log('DATA IMPORTED'.green.inverse);
      // if process ended successfully, exit
      process.exit(); 
    } catch (error) {
      // if process ended unsuccessfully, exit with error message
      console.error(`${error}`.red.inverse);
      process.exit(1); 
    }
}

// fuction to destroy data
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('DATA DESTROYED'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};


if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
