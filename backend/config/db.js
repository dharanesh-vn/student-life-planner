const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI will now be available because we loaded it in server.js
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;