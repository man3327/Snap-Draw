import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();    
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not set. Check the project root .env file.");
    }

    const connection = await mongoose.connect(
      mongoUri
    );

    console.log(
      `MongoDB connected:`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
export default connectDB;
