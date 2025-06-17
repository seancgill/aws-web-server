const express = require("express");
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// Configure winston logger with absolute path for reliability
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "/home/ubuntu/web-servers/log/eventsub-calls.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
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

// Middleware to add request ID and start time
router.use((req, res, next) => {
  req.requestId = uuidv4();
  req.startTime = Date.now();
  logger.info("Received webhook request", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// Webhook endpoint for call events
router.post("/eventsub-calls", (req, res) => {
  try {
    const payload = req.body;

    // Log headers and payload
    logger.info("Webhook call event received", {
      requestId: req.requestId,
      headers: req.headers,
      payload: payload,
    });

    const duration = Date.now() - req.startTime;
    logger.info("Webhook processed", {
      requestId: req.requestId,
      status: 200,
      durationMs: duration,
    });

    // Respond with success
    return res.status(200).json({ status: "Webhook received" });
  } catch (error) {
    logger.error("Unexpected error in webhook route", {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
