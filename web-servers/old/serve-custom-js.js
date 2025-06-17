const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
const port = 443; // HTTPS port
const httpPort = 8080; // HTTP port for redirection



const jsCodeSGDemoThree = `
var paybill = '<li><a href="https://netsapiens.com" target="_blank" class="header-link" > Pay my bill</a></li>';
var opentix = '<li><a href="https://netsapiens.com" target="_blank" class="header-link" > Open a ticket</a></li>';
var Docs = '<li><a href="https://documentation.netsapiens.com" target="_blank" class="header-link" > Knowledge Base</a></li>';
var SiPbx = '<li><a href="https://core1-ord.sgdemothree.ucaas.tech/SiPbx" target="_blank" class="header-link" > SiPbx Admin</a></li>';
var NDP = '<li><a href="https://core2-ord.sgdemothree.ucaas.tech/ndp" target="_blank" class="header-link" > NDP Admin</a></li>';
var LiCf = '<li><a href="https://core1-ord.sgdemothree.ucaas.tech/LiCf" target="_blank" class="header-link" > LiCf (Recording) Admin</a></li>';

$('.user-toolbar').prepend(paybill);
$('.user-toolbar').prepend(opentix);
$('.user-toolbar').prepend(Docs);
$('.user-toolbar').prepend(SiPbx);
$('.user-toolbar').prepend(NDP);
$('.user-toolbar').prepend(LiCf);
`;
app.get('/get-script/ver1', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(jsCodeSGDemoThree);
});





// HTTPS server
const sslOptions = {
    cert: fs.readFileSync('/etc/letsencrypt/live/sgdemo-aws.work/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/sgdemo-aws.work/privkey.pem')
};

const httpsServer = https.createServer(sslOptions, app);

// HTTP server for redirecting to HTTPS
const httpApp = express();
httpApp.all('*', (req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
});
const httpServer = http.createServer(httpApp);

// Start both servers
httpsServer.listen(port, () => {
    console.log(`HTTPS server running at https://sgdemo-aws.work:${port}`);
});
httpServer.listen(httpPort, () => {
    console.log(`HTTP server running at http://localhost:${httpPort} (redirects to HTTPS)`);
});
