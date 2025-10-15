import mongoose from "mongoose";
import process from "node:process";
import { MONGO_URI } from "./env.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("MongoDB is Connected!");
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};

export default connectDB;