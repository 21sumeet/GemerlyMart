const mongoose = require("mongoose");
// require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected successfully ${mongoose.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed");
    console.log(error);
  }
};

module.exports = connectDB;
