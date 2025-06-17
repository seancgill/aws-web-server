const express = require('express');
const winston = require('winston');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Configure winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: '/home/ubuntu/web-servers/log/messages.log',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
      maxsize: 10485760, // 10MB max file size
      maxFiles: 5, // Keep up to 5 rotated log files
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Middleware to parse JSON bodies
router.use(express.json());

// Middleware to add request ID and start time
router.use((req, res, next) => {
  req.requestId = uuidv4();
  req.startTime = Date.now();
  logger.info('Received message request', {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    ip: req.ip,
    headers: req.headers,
    userAgent: req.get('User-Agent'),
  });
  next();
});

// Messages POST endpoint
router.post('/messages', (req, res) => {
  try {
    // Log the entire POST body
    logger.info('Captured message data', {
      requestId: req.requestId,
      payload: req.body,
    });

    const duration = Date.now() - req.startTime;
    logger.info('Sending response', {
      requestId: req.requestId,
      status: 200,
      durationMs: duration,
    });

    return res.status(200).json({ message: 'OK' });
  } catch (error) {
    logger.error('Unexpected error in messages route', {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
