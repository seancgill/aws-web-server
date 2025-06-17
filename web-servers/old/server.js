const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const WebSocket = require('ws');
const url = require('url');  // Add this for parsing WSS URL

const app = express();

app.get('/', (req, res) => {
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
          const socket = io('https://sgdemo-aws.work', { transports: ['websocket'] });
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

app.all('/streamtest', (req, res) => {
  console.log('Request method:', req.method);
  console.log('Query params:', req.query);
  console.log('Body:', req.body);
  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Stream url="wss://echo.websocket.org">
      <Parameter name="direction" value="bidirectional"/>
  </Stream>
</Response>`);
});

app.all('/streamstart', (req, res) => {
  console.log('Request method:', req.method);
  console.log('Query params:', req.query);
  console.log('Body:', req.body);
  // Use only custom params, not SIP params, in the WSS URL
  const { agent_id, called_number, caller_id, call_sid, conversation_signature } = req.query;
  const customAgentId = agent_id || 'Ht3KtACC4pQXIDzDYvTH';
  const customCalledNumber = called_number || '+14128952924';
  const customCallerId = caller_id || '+14847844455';
  const customCallSid = call_sid || 'CA6bb570a98ff8afe21b3aeb1b5ba40dzz';
  const customConvSig = conversation_signature || '1xs2D0rsG3YmAluI6cTn';

  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Stream url="wss://sgdemo-aws.work/wss-stream/?agent_id=${customAgentId}&called_number=${customCalledNumber}&caller_id=${customCallerId}&call_sid=${customCallSid}&conversation_signature=${customConvSig}">
      <Parameter name="direction" value="bidirectional"/>
  </Stream>
</Response>`);
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.emit('message', 'Welcome to the WebSocket server!');
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const wss = new WebSocket.Server({ server, path: '/wss-stream' });
wss.on('connection', (ws, req) => {
  const params = url.parse(req.url, true).query;  // Parse WSS URL query params
  console.log('WSS client connected');
  console.log('WSS query params:', params);  // Log the parameters
  ws.on('message', (message) => {
    console.log('WSS received:', message);
    ws.send(`Echo: ${message}`);
  });
  ws.on('close', () => {
    console.log('WSS client disconnected');
  });
});

server.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});