const express = require("express");
const router = express.Router();

// Middleware to allow iframing
router.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' *.ucaas.tech"
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route to handle iframe content
router.get("/iframe-test", (req, res) => {
  const { nsToken, cookieName, cookie } = req.query;

  const authStatus =
    nsToken && cookieName && cookie
      ? `Authenticated with token: ${nsToken.substring(0, 10)}...`
      : "No authentication parameters provided";

  // Serve HTML content with user@domainname display and styling
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Iframe App</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
          background-color: #f0f0f0;
          color: #333;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          margin: 10px 0;
        }
        form {
          margin: 20px auto;
          max-width: 400px;
        }
        input[type="text"] {
          padding: 10px;
          margin: 5px;
          width: 100%;
          max-width: 300px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
          margin: 5px;
        }
        button:hover {
          background-color: #0056b3;
        }
        .auto-answer-btn {
          background-color: #28a745;
        }
        .auto-answer-btn:hover {
          background-color: #218838;
        }
        #call-status {
          font-weight: bold;
          color: #333;
        }
      </style>
    </head>
    <body>
      <h1>Test Iframe App</h1>
      <p>This is a simple app running in an iframe within SNAPmobile Web PWA.</p>
      <p>Authentication Status: ${authStatus}</p>
      <p>User Extension: <span id="user-extension">Loading...</span></p>
      <form id="callForm">
        <input type="text" id="phoneNumber" placeholder="Enter phone number to dial" required>
        <input type="text" id="callerId" placeholder="Enter caller ID number" required>
        <button type="submit">Make Call</button>
        <button type="submit" class="auto-answer-btn">Make Call (Auto-Answer)</button>
      </form>
      <p id="call-status"></p>
      <script>
        // Decode JWT to get user@domainname
        function decodeJWT(token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload).sub || 'Unknown';
          } catch (error) {
            return 'Unknown';
          }
        }

        // Get nsToken from URL and display user@domainname
        const urlParams = new URLSearchParams(window.location.search);
        const nsToken = urlParams.get('nsToken');
        document.getElementById('user-extension').textContent = nsToken ? decodeJWT(nsToken) : 'Unknown';

        // Placeholder form handler
        document.getElementById('callForm').addEventListener('submit', function(e) {
          e.preventDefault();
          document.getElementById('call-status').textContent = 'Call functionality not implemented.';
        });
      </script>
    </body>
    </html>
  `);
});

module.exports = router;
