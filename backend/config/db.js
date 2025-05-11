import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const mongoURI = process.env.MONGODB_URL;

export const connectDB = async () => {
  // Check if mongoURI is available
  if (!mongoURI) {
    console.error("MongoDB URL is not defined in environment variables");
    process.exit(1); // Exit the process if the MongoDB URI is not defined
  }

  try {
    await mongoose.connect(mongoURI); // No need for useNewUrlParser and useUnifiedTopology
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the process if there's a connection error
  }
};
