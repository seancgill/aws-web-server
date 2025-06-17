const express = require("express");
const router = express.Router();

// Middleware to allow iframing
router.use((req, res, next) => {
  // Remove X-Frame-Options to allow iframing
  res.removeHeader("X-Frame-Options");
  // Set Content-Security-Policy to allow iframing from specific domains
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' *.ucaas.tech"
  );
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route to handle iframe content
router.get("/iframe-test", (req, res) => {
  // Extract authentication parameters from query
  const { nsToken, cookieName, cookie } = req.query;

  // Basic validation of authentication parameters
  const authStatus =
    nsToken && cookieName && cookie
      ? `Authenticated with token: ${nsToken.substring(0, 10)}...`
      : "No authentication parameters provided";

  // Serve HTML content with form and API call logic
  res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Custom Dialer App</title>
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
                }
                .form-container {
                    margin: 20px auto;
                    max-width: 400px;
                }
                input[type="text"] {
                    padding: 10px;
                    margin: 10px;
                    width: 100%;
                    max-width: 300px;
                    font-size: 16px;
                }
                button {
                    padding: 10px 20px;
                    font-size: 16px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    cursor: pointer;
                    border-radius: 5px;
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
                    margin-top: 20px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Test Iframe App</h1>
            <p>This is a simple app running in an iframe within SNAPmobile Web PWA.</p>
            <p>Authentication Status: ${authStatus}</p>
            <p>User Extension: <span id="user-extension">Loading...</span></p>
            <div class="form-container">
                <input type="text" id="phoneNumber" placeholder="Enter phone number to dial" required>
                <input type="text" id="callerId" placeholder="Enter caller ID number" required>
                <button onclick="initiateCall(false)">Make Call</button>
                <button class="auto-answer-btn" onclick="initiateCall(true)">Make Call (Auto-Answer)</button>
            </div>
            <p id="call-status"></p>
            <script>
                function sanitizePhoneNumber(number) {
                    return number.replace(/[^0-9]/g, '');
                }

                function decodeJWT(token) {
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        return JSON.parse(jsonPayload).sub || null;
                    } catch (error) {
                        console.error('Error decoding JWT:', error);
                        return null;
                    }
                }

                function generateCallId() {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    let result = '';
                    for (let i = 0; i < 24; i++) {
                        result += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    return result;
                }

                async function initiateCall(autoAnswer) {
                    const phoneNumber = document.getElementById('phoneNumber').value;
                    const callerId = document.getElementById('callerId').value;
                    const callStatus = document.getElementById('call-status');

                    if (!phoneNumber || !callerId) {
                        callStatus.textContent = 'Please enter both phone number and caller ID.';
                        return;
                    }

                    const sanitizedPhoneNumber = sanitizePhoneNumber(phoneNumber);
                    const sanitizedCallerId = sanitizePhoneNumber(callerId);

                    if (!sanitizedPhoneNumber || !sanitizedCallerId) {
                        callStatus.textContent = 'Invalid phone number or caller ID.';
                        return;
                    }

                    // Decode JWT to get extension@domain
                    const userExtension = decodeJWT('${nsToken}');
                    document.getElementById('user-extension').textContent = userExtension || 'Unknown';
                    if (!userExtension) {
                        callStatus.textContent = 'Error: Unable to fetch user extension from token.';
                        return;
                    }

                    const callId = generateCallId();
                    console.log('Generated Call ID:', callId);

                    const payload = {
                        synchronous: "no",
                        "dial-rule-application": "call",
                        "call-orig-user": userExtension,
                        "auto-answer-enabled": autoAnswer ? "yes" : "no",
                        "call-id": callId,
                        "call-term-user": sanitizedPhoneNumber,
                        "caller-id-number": sanitizedCallerId,
                        "callback-caller-id-number": "18587645226"
                    };

                    try {
                        const response = await fetch('https://core1-ord.sgdemothree.ucaas.tech/ns-api/v2/domains/' + userExtension.split('@')[1] + '/users/' + userExtension.split('@')[0] + '/calls', {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ${nsToken}'
                            },
                            body: JSON.stringify(payload)
                        });

                        if (response.ok) {
                            callStatus.textContent = autoAnswer ? 'Call initiated with auto-answer!' : 'Call initiated successfully!';
                        } else {
                            const errorData = await response.json();
                            callStatus.textContent = 'Error initiating call: ' + (errorData.message || response.statusText);
                        }
                    } catch (error) {
                        callStatus.textContent = 'Error initiating call: ' + error.message;
                    }
                }
            </script>
        </body>
        </html>
    `);
});

module.exports = router;

