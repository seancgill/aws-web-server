const jwt = require('jsonwebtoken');
require('dotenv').config();

const payload = { clientId: 'sg-demo-key' }; // Customize as needed
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' }); // 30-day expiration
console.log('Bearer Token:', token);
