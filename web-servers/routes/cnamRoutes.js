const express = require("express");
const winston = require("winston");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

// Configure winston logger with absolute path for reliability
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "/home/ubuntu/web-servers/log/cnam-server-logs/cnam.log",
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
  logger.info("Received CNAM request", {
    requestId: req.requestId,
    method: req.method,
    url: req.originalUrl,
    query: req.query,
    ip: req.ip,
    headers: req.headers,
    userAgent: req.get("User-Agent"),
  });
  next();
});

// CNAM route
router.get("/cnam", (req, res) => {
  try {
    // Extract query parameters (accept 'ani' or 'number')
    const ani = (req.query.ani || req.query.number)?.trim();
    const dnis = req.query.dnis?.trim();

    // Log query parameters
    logger.info("Parsed query parameters", {
      requestId: req.requestId,
      ani,
      dnis,
    });

    // Validate required parameters
    if (!ani || !dnis) {
      logger.error("Missing ANI or DNIS", {
        requestId: req.requestId,
        query: { ani, dnis },
      });
      return res.status(400).json({ error: "Missing ANI or DNIS" });
    }

    // Check if ANI matches
    if (ani === "18582515907" || ani === "+18582515907") {
      const cnamResponse = {
        ani: ani,
        dnis: dnis,
        cnam: "Crex DID Test CNAM",
      };

      const duration = Date.now() - req.startTime;
      logger.info("Sending CNAM response", {
        requestId: req.requestId,
        status: 200,
        response: cnamResponse,
        durationMs: duration,
      });

      return res.status(200).json(cnamResponse);
    }

    // Fallback response
    const fallbackResponse = {
      ani: ani,
      dnis: dnis,
      cnam: "Name lookup failed",
    };

    const duration = Date.now() - req.startTime;
    logger.info("Sending fallback response", {
      requestId: req.requestId,
      status: 200,
      response: fallbackResponse,
      durationMs: duration,
    });

    return res.status(200).json(fallbackResponse);
  } catch (error) {
    logger.error("Unexpected error in CNAM route", {
      requestId: req.requestId,
      error: error.message,
      stack: error.stack,
    });
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
