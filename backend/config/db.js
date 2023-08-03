import mongoose from "mongoose";

// any method we call from mongoose model or mongoose itself...
// will return a promise, that's why it's asyc
const connectDB = async () => { 
  try {
    // calling mongoose.connect, will await and return a promise
    // accessing MONGO_URL from enviroment variable
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.log(`error: ${error.message}`)
    process.exit(1);
  }
};

export default connectDB;