// mongoose is an npm package that acts as a bridge between your Node.js code and MongoDB.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("ENV CHECK:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;