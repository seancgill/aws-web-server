const express = require("express");
const router = express.Router();
const winston = require("winston");

// Use the global Winston logger configured in app.js
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "/home/ubuntu/web-servers/log/app.log",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.json()
      ),
      maxsize: 10485760,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Public route: Serve caller-ids content for iframe
router.get("/caller-ids", (req, res) => {
  logger.info("Serving caller-ids content", { requestId: req.requestId });
  res.send(`
        <html>
            <head>
                <title>Caller IDs</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #333; }
                    p { color: #666; }
                </style>
            </head>
            <body>
                <h1>Caller IDs</h1>
                <p>This is a placeholder for the Caller IDs content.</p>
                <p>Replace this with actual Caller ID data or functionality.</p>
            </body>
        </html>
    `);
});

module.exports = router;
