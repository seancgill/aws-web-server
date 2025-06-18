const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const socketIo = require("socket.io");
const WebSocket = require("ws");
const url = require("url");
const winston = require("winston");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const extraJsRoutes = require("./routes/extraJsRoutes");
const imageRoutes = require("./routes/imageRoutes");
const websocketRoutes = require("./routes/websocketRoutes");
const iframeRoute = require("./routes/iframeRoute");
const logRoutes = require("./routes/logRoutes");
const cnamRoutes = require("./routes/cnamRoutes");
const messageRoutes = require("./routes/messageRoutes");
const callerIDsRoute = require("./routes/callerIDsRoute");
const eventsubCallsRoute = require("./routes/eventsubCalls");

const app = express();
const port = 443; // HTTPS port
const httpPort = 8080; // HTTP port for redirection

// Configure global Winston logger
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

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json({ limit: "1mb" })); // Limit body size to 1MB
app.use(express.urlencoded({ extended: true }));

// Bot detection and method filtering
app.use((req, res, next) => {
  const blockedMethods = ["PROPFIND", "HEAD", "TRACE", "DELETE", "PUT"];
  const suspiciousPaths = ["/wp-login.php", "/.env", "/admin"];
  if (
    blockedMethods.includes(req.method) ||
    suspiciousPaths.includes(req.path)
  ) {
    logger.warn("Suspicious request blocked", {
      requestId: uuidv4(),
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
    return res.status(403).json({ error: "Forbidden: Suspicious request" });
  }
  next();
});

// Rate limiting middleware
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: { error: "Too many requests, please try again later" },
});
app.use(limiter);

// Specific rate limiting for /cnam
const cnamLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Allow more for CNAM lookups
  message: { error: "Too many CNAM requests, please try again later" },
});

// Middleware to log all incoming requests with detailed info
app.use((req, res, next) => {
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Mask sensitive headers (e.g., Authorization)
  const maskedHeaders = { ...req.headers };
  if (maskedHeaders.authorization) {
    const token = maskedHeaders.authorization.replace(/^Bearer\s+/, "");
    maskedHeaders.authorization = `Bearer ${token.slice(0, 4)}...${token.slice(
      -4
    )}`;
  }

  // Log incoming request
  logger.info("Incoming request", {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    path: req.path,
    query: req.query,
    body: req.body,
    ip: req.ip,
    headers: maskedHeaders,
    userAgent: req.get("User-Agent"),
  });

  // Specifically log /messages and /cnam requests
  if (
    (req.path === "/messages" && req.method === "POST") ||
    req.path === "/cnam"
  ) {
    logger.info(`${req.path} endpoint request`, {
      requestId: req.requestId,
      body: req.body,
      query: req.query,
      ip: req.ip,
    });
  }

  // Log response details after sending
  res.on("finish", () => {
    const durationMs = Date.now() - req.startTime;
    logger.info("Response sent", {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      durationMs,
      ip: req.ip,
    });
  });

  next();
});

// Middleware to verify API key as Bearer token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    logger.warn("No API key provided", { requestId: req.requestId });
    return res
      .status(401)
      .json({ error: "Access denied: No API key provided" });
  }

  // Load API keys from .env (comma-separated list)
  const validApiKeys = process.env.API_KEYS
    ? process.env.API_KEYS.split(",")
    : [];

  if (validApiKeys.includes(token)) {
    logger.info("API key verified", {
      requestId: req.requestId,
      apiKey: `${token.slice(0, 4)}...${token.slice(-4)}`,
    });
    req.client = { apiKey: token };
    next();
  } else {
    logger.error("Invalid API key", {
      requestId: req.requestId,
      apiKey: `${token.slice(0, 4)}...${token.slice(-4)}`,
    });
    return res.status(403).json({ error: "Access denied: Invalid API key" });
  }
};

// Public route: Serve test page for WebSocket connections
app.get("/", (req, res) => {
  res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Basic WebSocket Server</title>
          </head>
          <body>
            <h1>Hello from Node.js!</h1>
            <p>Socket.IO status: <span id="socketio-status">Disconnected</span></p>
            <p>WSS status: <span id="wss-status">Disconnected</span></p>
            <script src="/socket.io/socket.io.js"></script>
            <script>
              const socket = io('https://sgdemo-aws.work', { transports: ['websocket'], auth: { token: 'your_api_key_here' } });
              socket.on('connect', () => {
                document.getElementById('socketio-status').textContent = 'Connected';
              });
              socket.on('message', (msg) => {
                console.log('Socket.IO message:', msg);
              });
              socket.on('disconnect', () => {
                document.getElementById('socketio-status').textContent = 'Disconnected';
              });

              const wss = new WebSocket('wss://sgdemo-aws.work/wss-stream');
              wss.onopen = () => {
                document.getElementById('wss-status').textContent = 'Connected';
                wss.send('Hello from client!');
              };
              wss.onmessage = (event) => {
                console.log('WSS message:', event.data);
              };
              wss.onclose = () => {
                document.getElementById('wss-status').textContent = 'Disconnected';
              };
            </script>
          </body>
        </html>
    `);
});

// Mount routes (public and protected)
app.use("/", extraJsRoutes);
app.use("/", imageRoutes);
app.use("/", iframeRoute);
app.use("/", callerIDsRoute);
app.use("/", eventsubCallsRoute);
app.use("/logs", authenticateToken, logRoutes);
app.use("/", authenticateToken, websocketRoutes);
app.use("/cnam", cnamLimiter, authenticateToken, cnamRoutes); // CNAM with specific rate limiting
app.use("/", authenticateToken, messageRoutes);

// Add CORS headers
const cors = require("cors");
// Global CORS for POST/OPTIONS
app.use(
  cors({
    origin: [
      "https://portal.sgdemothree.ucaas.tech",
      "https://core1-ord.sgdemothree.ucaas.tech",
    ],
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-Id"],
  })
);
// Route-specific CORS for /cnam to allow GET
app.use(
  "/cnam",
  cors({
    origin: [
      "https://portal.sgdemothree.ucaas.tech",
      "https://core1-ord.sgdemothree.ucaas.tech",
    ],
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-Id"],
  })
);

// Catch-all for unmatched routes
app.use((req, res) => {
  logger.info("Unmatched route", {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
  });
  res.status(404).json({ error: "Cannot find the requested resource" });
});

// HTTPS server
const sslOptions = {
  cert: fs.readFileSync("/etc/letsencrypt/live/sgdemo-aws.work/fullchain.pem"),
  key: fs.readFileSync("/etc/letsencrypt/live/sgdemo-aws.work/privkey.pem"),
};
const httpsServer = https.createServer(sslOptions, app);

// HTTP server for redirecting to HTTPS
const httpApp = express();
httpApp.all("*", (req, res) => {
  res.redirect(301, `https://${req.headers.host}${req.url}`);
});
const httpServer = http.createServer(httpApp);

// Initialize Socket.IO with authentication
const io = socketIo(httpsServer, {
  path: "/socket.io",
  cors: {
    origin: [
      "https://portal.sgdemothree.ucaas.tech",
      "https://core1-ord.sgdemothree.ucaas.tech",
    ],
    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const validApiKeys = process.env.API_KEYS
    ? process.env.API_KEYS.split(",")
    : [];
  if (validApiKeys.includes(token)) {
    next();
  } else {
    logger.warn("Unauthorized Socket.IO connection", { token });
    next(new Error("Unauthorized"));
  }
});
io.on("connection", (socket) => {
  logger.info("Socket.IO client connected", { socketId: socket.id });
  socket.emit("message", "Welcome to the WebSocket server!");
  socket.on("disconnect", () => {
    logger.info("Socket.IO client disconnected", { socketId: socket.id });
  });
});

// Initialize WebSocket (WSS) with authentication
const wss = new WebSocket.Server({ server: httpsServer, path: "/wss-stream" });
wss.on("connection", (ws, req) => {
  const params = url.parse(req.url, true).query;
  const token = params.token;
  const validApiKeys = process.env.API_KEYS
    ? process.env.API_KEYS.split(",")
    : [];
  if (!validApiKeys.includes(token)) {
    logger.warn("Unauthorized WSS connection", { token });
    ws.close(1008, "Unauthorized");
    return;
  }
  logger.info("WSS client connected", { queryParams: params });
  ws.on("message", (message) => {
    logger.info("WSS received", { message: message.toString() });
    ws.send(`Echo: ${message}`);
  });
  ws.on("close", () => {
    logger.info("WSS client disconnected");
  });
});

// Start both servers
httpsServer
  .listen(port, () => {
    logger.info(`HTTPS server running at https://sgdemo-aws.work:${port}`);
  })
  .on("error", (err) => {
    logger.error("HTTPS server error:", { error: err.message });
    process.exit(1);
  });

httpServer
  .listen(httpPort, () => {
    logger.info(
      `HTTP server running at http://localhost:${httpPort} (redirects to HTTPS)`
    );
  })
  .on("error", (err) => {
    logger.error("HTTP server error:", { error: err.message });
    process.exit(1);
  });
