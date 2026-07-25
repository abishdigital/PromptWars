const mongoose = require('mongoose');
const logger = require('../utils/logger');

let cachedConnection = null;

const connectDB = async (customUri) => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  let uri = customUri || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recovery_platform';

  // Format MongoDB Atlas URI cleanly
  if (uri.includes('mongodb.net')) {
    if (/mongodb\.net\/?$/.test(uri.trim())) {
      uri = uri.trim().replace(/\/$/, '') + '/recovery_platform?retryWrites=true&w=majority';
    } else if (/mongodb\.net\/\?/.test(uri.trim())) {
      uri = uri.trim().replace('mongodb.net/?', 'mongodb.net/recovery_platform?');
    }
  }

  try {
    const opts = {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      bufferCommands: true,
    };

    logger.info(`[MongoDB] Connecting to database...`);
    const conn = await mongoose.connect(uri, opts);
    cachedConnection = conn;
    logger.info(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`[MongoDB Error] Connection failed: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
