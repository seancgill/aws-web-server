const express = require('express');
const router = express.Router();

// Dynamic endpoint for /get-script/:custID/ver1
router.get('/get-script/:custID/ver1', (req, res) => {
    const custID = req.params.custID; // Extract custID from URL
    const website = req.query.website || 'https://netsapiens.com'; // Extract website from query, default to netsapiens.com
    let color = req.query.color || 'white'; // Extract color from query, default to white

    // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
        return res.status(400).send('Invalid custID');
    }

    // Validate website URL format (basic check)
    if (!/^[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
        return res.status(400).send('Invalid website URL');
    }

    // Validate color as a hex value (e.g., #FF0000 or FF0000)
    color = color.replace(/^#/, ''); // Remove leading # if present
    if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
        color = 'FFFFFF'; // Default to white (#FFFFFF) if invalid
    }
    color = `#${color}`; // Ensure color has leading # for CSS

    // JavaScript code with dynamic custID, website, and color
    const jsCode = `
if (typeof $ === 'undefined') {
    console.error('jQuery is not available. Cannot add toolbar links or modify login box.');
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
            // Add toolbar links
            var $toolbar = $('.user-toolbar');
            if ($toolbar.length === 0) {
                console.error('User toolbar (.user-toolbar) not found in the DOM. Falling back to body.');
                $toolbar = $('body');
                var style = document.createElement('style');
                style.innerHTML = '.header-link { color: #fff; background-color: #333; padding: 10px 15px; text-decoration: none; display: inline-block; margin: 5px; } .header-link:hover { background-color: #555; } .dropdown-menu { background-color: #fff; border: 1.0px solid #ccc; } .dropdown-menu li a { color: #333; padding: 5px 10px; display: block; } .dropdown-menu li a:hover { background-color: #f0f0f0; }';
                document.head.appendChild(style);
            } else {
                console.log('User toolbar found. Adding links...');
            }

            var paybill = '<li><a href="${website}" target="_blank" class="header-link">Business Website</a></li>';
            var api = '<li><a href="https://docs.ns-api.com/reference/" target="_blank" class="header-link">API Docs</a></li>';
            var Docs = '<li><a href="https://documentation.netsapiens.com" target="_blank" class="header-link">Documentation</a></li>';
            var adminTools = '<li class="dropdown"><a href="https://core1-ord.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-ord.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-ord.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-ord.${custID}.ucaas.tech/LiCf/adminlogin.php" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

            $toolbar.prepend(paybill);
            $toolbar.prepend(api);
            $toolbar.prepend(Docs);
            $toolbar.prepend(adminTools);

            // Change login box background color
            var $loginBox = $('#login-box');
            if ($loginBox.length) {
                $loginBox.css('background-color', '${color}');
                console.log('Background color of #login-box changed to ${color}.');
            } else {
                console.warn('Element with ID "login-box" not found.');
            }
        });
    }
}
`;

    res.set('Content-Type', 'text/plain');
    res.send(jsCode);
});

// Dynamic endpoint for /ord/:custID/ver1
router.get('/ord/:custID/ver1', (req, res) => {
    const custID = req.params.custID; // Extract custID from URL
    const website = req.query.website || 'https://netsapiens.com'; // Extract website from query, default to netsapiens.com
    let color = req.query.color || 'white'; // Extract color from query, default to white

    // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
        return res.status(400).send('Invalid custID');
    }

    // Validate website URL format (basic check)
    if (!/^[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
        return res.status(400).send('Invalid website URL');
    }

    // Validate color as a hex value (e.g., #FF0000 or FF0000)
    color = color.replace(/^#/, ''); // Remove leading # if present
    if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
        color = 'FFFFFF'; // Default to white (#FFFFFF) if invalid
    }
    color = `#${color}`; // Ensure color has leading # for CSS

    // JavaScript code with dynamic custID, website, and color
    const jsCode = `
if (typeof $ === 'undefined') {
    console.error('jQuery is not available. Cannot add toolbar links or modify login box.');
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
            // Add toolbar links
            var $toolbar = $('.user-toolbar');
            if ($toolbar.length === 0) {
                console.error('User toolbar (.user-toolbar) not found in the DOM. Falling back to body.');
                $toolbar = $('body');
                var style = document.createElement('style');
                style.innerHTML = '.header-link { color: #fff; background-color: #333; padding: 10px 15px; text-decoration: none; display: inline-block; margin: 5px; } .header-link:hover { background-color: #555; } .dropdown-menu { background-color: #fff; border: 1.0px solid #ccc; } .dropdown-menu li a { color: #333; padding: 5px 10px; display: block; } .dropdown-menu li a:hover { background-color: #f0f0f0; }';
                document.head.appendChild(style);
            } else {
                console.log('User toolbar found. Adding links...');
            }

            var paybill = '<li><a href="${website}" target="_blank" class="header-link">Business Website</a></li>';
            var api = '<li><a href="https://docs.ns-api.com/reference/" target="_blank" class="header-link">API Docs</a></li>';
            var Docs = '<li><a href="https://documentation.netsapiens.com" target="_blank" class="header-link">Documentation</a></li>';
            var adminTools = '<li class="dropdown"><a href="https://core1-ord.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-ord.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-ord.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-ord.${custID}.ucaas.tech/LiCf/adminlogin.php" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

            $toolbar.prepend(paybill);
            $toolbar.prepend(api);
            $toolbar.prepend(Docs);
            $toolbar.prepend(adminTools);

            // Change login box background color
            var $loginBox = $('#login-box');
            if ($loginBox.length) {
                $loginBox.css('background-color', '${color}');
                console.log('Background color of #login-box changed to ${color}.');
            } else {
                console.warn('Element with ID "login-box" not found.');
            }
        });
    }
}
`;

    res.set('Content-Type', 'text/plain');
    res.send(jsCode);
});

module.exports = router;
