const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();
const port = 443; // HTTPS port
const httpPort = 8080; // HTTP port for redirection

// Dynamic endpoint with custID and optional website query parameter
app.get('/get-script/:custID/ver1', (req, res) => {
    const custID = req.params.custID; // Extract custID from URL
    const website = req.query.website || 'https://netsapiens.com'; // Extract website from query, default to netsapiens.com

    // Validate custID to prevent injection attacks
    if (!/^[a-zA-Z0-9]+$/.test(custID)) {
        return res.status(400).send('Invalid custID');
    }

    // Validate website URL format (basic check)
    if (!/^[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
        return res.status(400).send('Invalid website URL');
    }

    // JavaScript code with dynamic custID and website
    const jsCode = `
if (typeof $ === 'undefined') {
    console.error('jQuery is not available. Cannot add toolbar links.');
} else {
    if (typeof $.fn.dropdown === 'undefined') {
        console.log('Bootstrap JS not found. Loading Bootstrap dynamically...');
        var script = document.createElement('script');
        script.src = 'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js';
        script.onload = function() {
            console.log('Bootstrap JS loaded dynamically.');
            addToolbarLinks();
        };
        script.onerror = function() {
            console.error('Failed to load Bootstrap JS dynamically. Dropdown may not function.');
            addToolbarLinks(); // Proceed anyway, links will still appear
        };
        document.head.appendChild(script);
    } else {
        addToolbarLinks();
    }

    function addToolbarLinks() {
        $(document).ready(function() {
            var $toolbar = $('.user-toolbar');
            if ($toolbar.length === 0) {
                console.error('User toolbar (.user-toolbar) not found in the DOM. Falling back to body.');
                $toolbar = $('body');
                var style = document.createElement('style');
                style.innerHTML = '.header-link { color: #fff; background-color: #333; padding: 10px 15px; text-decoration: none; display: inline-block; margin: 5px; } .header-link:hover { background-color: #555; } .dropdown-menu { background-color: #fff; border: 1px solid #ccc; } .dropdown-menu li a { color: #333; padding: 5px 10px; display: block; } .dropdown-menu li a:hover { background-color: #f0f0f0; }';
                document.head.appendChild(style);
            } else {
                console.log('User toolbar found. Adding links...');
            }

            var paybill = '<li><a href="${website}" target="_blank" class="header-link">Business Website</a></li>';
            var api = '<li><a href="https://docs.ns-api.com/reference/" target="_blank" class="header-link">API Docs</a></li>';
            var Docs = '<li><a href="https://documentation.netsapiens.com" target="_blank" class="header-link">Documentation</a></li>';
            var adminTools = '<li class="dropdown"><a href="https://core1-ord.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-ord.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-ord.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-ord.${custID}.ucaas.tech/LiCf" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

            $toolbar.prepend(paybill);
            $toolbar.prepend(api);
            $toolbar.prepend(Docs);
            $toolbar.prepend(adminTools);
        });
    }
}
`;

    res.set('Content-Type', 'text/plain');
    res.send(jsCode);
});

// Dynamic endpoint with custID and optional website query parameter
app.get('/ord/:custID/ver1', (req, res) => {
    const custID = req.params.custID; // Extract custID from URL
    const website = req.query.website || 'https://netsapiens.com'; // Extract website from query, default to netsapiens.com

    // Validate custID to prevent injection attacks
    if (!/^[a-zA-Z0-9]+$/.test(custID)) {
        return res.status(400).send('Invalid custID');
    }

    // Validate website URL format (basic check)
    if (!/^[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
        return res.status(400).send('Invalid website URL');
    }

    // JavaScript code with dynamic custID and website
    const jsCode = `
if (typeof $ === 'undefined') {
    console.error('jQuery is not available. Cannot add toolbar links.');
} else {
    if (typeof $.fn.dropdown === 'undefined') {
        console.log('Bootstrap JS not found. Loading Bootstrap dynamically...');
        var script = document.createElement('script');
        script.src = 'https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js';
        script.onload = function() {
            console.log('Bootstrap JS loaded dynamically.');
            addToolbarLinks();
        };
        script.onerror = function() {
            console.error('Failed to load Bootstrap JS dynamically. Dropdown may not function.');
            addToolbarLinks(); // Proceed anyway, links will still appear
        };
        document.head.appendChild(script);
    } else {
        addToolbarLinks();
    }

    function addToolbarLinks() {
        $(document).ready(function() {
            var $toolbar = $('.user-toolbar');
            if ($toolbar.length === 0) {
                console.error('User toolbar (.user-toolbar) not found in the DOM. Falling back to body.');
                $toolbar = $('body');
                var style = document.createElement('style');
                style.innerHTML = '.header-link { color: #fff; background-color: #333; padding: 10px 15px; text-decoration: none; display: inline-block; margin: 5px; } .header-link:hover { background-color: #555; } .dropdown-menu { background-color: #fff; border: 1px solid #ccc; } .dropdown-menu li a { color: #333; padding: 5px 10px; display: block; } .dropdown-menu li a:hover { background-color: #f0f0f0; }';
                document.head.appendChild(style);
            } else {
                console.log('User toolbar found. Adding links...');
            }

            var paybill = '<li><a href="${website}" target="_blank" class="header-link">Business Website</a></li>';
            var api = '<li><a href="https://docs.ns-api.com/reference" target="_blank" class="header-link">API Docs</a></li>';
            var Docs = '<li><a href="https://documentation.netsapiens.com" target="_blank" class="header-link">Documentation</a></li>';
            var adminTools = '<li class="dropdown"><a href="https://core1-ord.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-ord.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-ord.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-ord.${custID}.ucaas.tech/LiCf" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

            $toolbar.prepend(paybill);
            $toolbar.prepend(api);
            $toolbar.prepend(Docs);
            $toolbar.prepend(adminTools);
        });
    }
}
`;

    res.set('Content-Type', 'text/plain');
    res.send(jsCode);
});

// Add CORS headers to allow the NetSapiens Portal to access the script
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
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

// Start both servers with error handling
httpsServer.listen(port, () => {
    console.log(`HTTPS server running at https://sgdemo-aws.work:${port}`);
}).on('error', (err) => {
    console.error('HTTPS server error:', err);
    process.exit(1);
});

httpServer.listen(httpPort, () => {
    console.log(`HTTP server running at http://localhost:${httpPort} (redirects to HTTPS)`);
}).on('error', (err) => {
    console.error('HTTP server error:', err);
    process.exit(1);
});
