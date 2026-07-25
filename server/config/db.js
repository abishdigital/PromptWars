const mongoose = require('mongoose');

const connectDB = async (customUri) => {
  const uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recovery_platform';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    // In test environment or fallback mode, don't crash the app if DB connection isn't available
    if (process.env.NODE_ENV === 'test') {
      console.warn('[MongoDB] Test mode active, continuing with mock/memory fallback handling.');
    }
  }
};

module.exports = connectDB;
