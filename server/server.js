const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

// Connect to MongoDB
connectDB();

const server = app.listen(env.PORT, () => {
  logger.info(`[Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`[Unhandled Rejection] ${err.message}`);
});

module.exports = server;
