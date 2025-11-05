import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/warehouseService";

  try {
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected to:", mongoose.connection.db?.databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
