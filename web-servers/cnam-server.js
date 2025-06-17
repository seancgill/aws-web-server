process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

const express = require('express');
const app = express();
const port = 8080;
const basicAuth = require('express-basic-auth');

console.log('Server starting...');
app.use(express.json());

// Basic Auth Middleware
app.use(
  basicAuth({
    users: { 'sgdemo': 'cnam' }, // Replace with your desired username and password
    challenge: true, // Enables browser prompts
    unauthorizedResponse: (req) => 'Unauthorized', // Customize unauthorized response
  })
);


app.get('/cnam', (req, res) => {
  // Log the incoming request to command line
  console.log('Received HTTP Request:');
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.log(`Query Parameters: ${JSON.stringify(req.query, null, 2)}`);
  console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
  // Extract query parameters
  const ani = req.query.number?.trim();
  const dnis = req.query.dnis?.trim();

  // Validate required parameters
  if (!ani || !dnis) {
    return res.status(400).json({ error: 'Missing ANI or DNIS' });
  }

  console.log(`Processing CNAM request for ANI: ${ani}, DNIS: ${dnis}`);

  // Check if ANI matches
  if (ani === '18582515907') {
    const cnamResponse = {
      ani: ani,
      dnis: dnis,
      cnam: 'John Doe Test CNAM',
    };

    console.log(`Sending CNAM response: ${JSON.stringify(cnamResponse)}`);
    return res.status(200).json(cnamResponse);
  }

  // If ANI does not match, send fallback response
  const fallbackResponse = {
    ani: ani,
    dnis: dnis,
    cnam: 'Name lookup failed',
  };

  console.log(`Sending fallback response: ${JSON.stringify(fallbackResponse)}`);
  return res.status(200).json(fallbackResponse);
});




app.post('/webhook', (req, res) => {
  console.log('Received data 1:', req.body);
  res.send('Data received successfully!');
});

app.post('/webook2', (req, res) => {
  console.log('Received data 2:', req.body);
  res.send('Data received successfully!');
});


// Add a route for GET requests to the /webhook path
app.get('/test', (req, res) => {
  res.send('Hello, this is the GET endpoint for /test.');
});

// Add a generic route for GET requests on the root path
app.get('/', (req, res) => {
  res.send('Hello, this is the root path.');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
