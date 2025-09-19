import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  const {MONGO_URI} = ENV;
  
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error in the db file",error);
  }
}