const mongoose = require('mongoose');
const logger = require('../utils/logger');

let cachedConnection = null;

const connectDB = async (customUri) => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  let uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recovery_platform';

  // Ensure Atlas URI specifies target database name
  if (uri.includes('mongodb.net') && !uri.includes('mongodb.net/recovery_platform') && !uri.includes('mongodb.net/test')) {
    uri = uri.replace('mongodb.net/', 'mongodb.net/recovery_platform?').replace('mongodb.net?', 'mongodb.net/recovery_platform?');
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: true, // Allow Mongoose to buffer commands briefly while connecting
    };

    logger.info(`[MongoDB] Connecting to database...`);
    const conn = await mongoose.connect(uri, opts);
    cachedConnection = conn;
    logger.info(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`[MongoDB Error] Connection failed: ${error.message}`);
    logger.error(`[MongoDB Diagnostic] Please verify:
1. Network Access in MongoDB Atlas allows 0.0.0.0/0 (Access from anywhere).
2. The username & password in MONGODB_URI are correct.
3. Your database cluster is active in MongoDB Atlas.`);
    throw error;
  }
};

module.exports = connectDB;
