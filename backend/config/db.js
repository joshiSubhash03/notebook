const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MONGODB connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
