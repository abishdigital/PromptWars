const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

// Start standalone Express server if not running in a Vercel serverless environment
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(env.PORT, () => {
        logger.info(`[Server] Running in ${env.NODE_ENV} mode on port ${env.PORT}`);
      });
    })
    .catch((err) => {
      logger.error(`[Server Boot Error] Could not connect to database: ${err.message}`);
      app.listen(env.PORT, () => {
        logger.info(`[Server] Running in fallback mode on port ${env.PORT}`);
      });
    });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`[Unhandled Rejection] ${err.message}`);
});

module.exports = app;
