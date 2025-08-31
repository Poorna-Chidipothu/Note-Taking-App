import mongoose from "mongoose";

const connectDB = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Database.");
  } catch (err) {
    console.error("Failed to Connect Databse:", err);
    process.exit(1); // stop server if DB connection fails
  }
};

export default connectDB;
