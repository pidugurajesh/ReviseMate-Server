const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/revisemate";
    await mongoose.connect(connUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
