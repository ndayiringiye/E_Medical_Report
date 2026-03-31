import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGO_URI:", process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("database connection failed:", error);
  }
};