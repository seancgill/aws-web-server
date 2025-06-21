const express = require("express");
const router = express.Router();

// Dynamic endpoint for /ord/:custID/ver1
router.get("/ord/:custID/ver1", (req, res) => {
  const custID = req.params.custID; // Extract custID from URL
  const website = req.query.website || "https://netsapiens.com"; // Extract website from query, default to netsapiens.com
  let color = req.query.color || "white"; // Extract color from query, default to white

  // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
    return res.status(400).send("Invalid custID");
  }

  // Validate website URL format (improved regex)
  if (!/^(https?:\/\/)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
    return res.status(400).send("Invalid website URL");
  }

  // Validate color as a hex value (e.g., #FF0000 or FF0000)
  color = color.replace(/^#/, ""); // Remove leading # if present
  if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
    color = "FFFFFF"; // Default to white (#FFFFFF) if invalid
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

  res.set("Content-Type", "text/plain");
  res.send(jsCode);
});

// Dynamic endpoint for /ord/:custID/ver1
router.get("/phx/:custID/ver1", (req, res) => {
  const custID = req.params.custID; // Extract custID from URL
  const website = req.query.website || "https://netsapiens.com"; // Extract website from query, default to netsapiens.com
  let color = req.query.color || "white"; // Extract color from query, default to white

  // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
    return res.status(400).send("Invalid custID");
  }

  // Validate website URL format (improved regex)
  if (!/^(https?:\/\/)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
    return res.status(400).send("Invalid website URL");
  }

  // Validate color as a hex value (e.g., #FF0000 or FF0000)
  color = color.replace(/^#/, ""); // Remove leading # if present
  if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
    color = "FFFFFF"; // Default to white (#FFFFFF) if invalid
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
            var adminTools = '<li class="dropdown"><a href="https://core1-phx.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-phx.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-phx.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-phx.${custID}.ucaas.tech/LiCf/adminlogin.php" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

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

  res.set("Content-Type", "text/plain");
  res.send(jsCode);
});

// Dynamic endpoint for /ord/:custID/ver1
router.get("/phx/:custID/ver1", (req, res) => {
  const custID = req.params.custID; // Extract custID from URL
  const website = req.query.website || "https://netsapiens.com"; // Extract website from query, default to netsapiens.com
  let color = req.query.color || "white"; // Extract color from query, default to white

  // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
    return res.status(400).send("Invalid custID");
  }

  // Validate website URL format (improved regex)
  if (!/^(https?:\/\/)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
    return res.status(400).send("Invalid website URL");
  }

  // Validate color as a hex value (e.g., #FF0000 or FF0000)
  color = color.replace(/^#/, ""); // Remove leading # if present
  if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
    color = "FFFFFF"; // Default to white (#FFFFFF) if invalid
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
            var adminTools = '<li class="dropdown"><a href="https://core1-phx.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-phx.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-phx.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-phx.${custID}.ucaas.tech/LiCf/adminlogin.php" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

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

  res.set("Content-Type", "text/plain");
  res.send(jsCode);
});

// Dynamic endpoint for /ord/:custID/ver1
router.get("/iad/:custID/ver1", (req, res) => {
  const custID = req.params.custID; // Extract custID from URL
  const website = req.query.website || "https://netsapiens.com"; // Extract website from query, default to netsapiens.com
  let color = req.query.color || "white"; // Extract color from query, default to white

  // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
    return res.status(400).send("Invalid custID");
  }

  // Validate website URL format (improved regex)
  if (!/^(https?:\/\/)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+$/.test(website)) {
    return res.status(400).send("Invalid website URL");
  }

  // Validate color as a hex value (e.g., #FF0000 or FF0000)
  color = color.replace(/^#/, ""); // Remove leading # if present
  if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
    color = "FFFFFF"; // Default to white (#FFFFFF) if invalid
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
            var adminTools = '<li class="dropdown"><a href="https://core1-iad.${custID}.ucaas.tech/admin" class="dropdown-toggle header-link" data-toggle="dropdown">Admin UI<span class="caret"></span></a><ul class="dropdown-menu" role="menu"><li><a href="https://core1-iad.${custID}.ucaas.tech/SiPbx" target="_blank">SiPbx (Core) Admin</a></li><li><a href="https://core2-iad.${custID}.ucaas.tech/ndp" target="_blank">NDP (Endpoints) Admin</a></li><li><a href="https://core1-iad.${custID}.ucaas.tech/LiCf/adminlogin.php" target="_blank">LiCf (Recording) Admin</a></li><li><a href="https://insight.netsapiens.com" target="_blank">Insight</a></li></ul></li>';

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

  res.set("Content-Type", "text/plain");
  res.send(jsCode);
});

// Dynamic endpoint for /ord/:custID/ver2
router.get("/ord/:custID/ver2", (req, res) => {
  const custID = req.params.custID; // Extract custID from URL
  const website = req.query.website || "https://netsapiens.com"; // Extract website from query, default to netsapiens.com
  let color = req.query.color || "white"; // Extract color from query, default to white

  // Validate custID to prevent injection attacks, allowing alphanumeric and hyphens
  if (!/^[a-zA-Z0-9-]+$/.test(custID)) {
    return res.status(400).send("Invalid custID");
  }

  // Validate website URL format (improved regex to support full URLs)
  if (!/^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[/#?]?.*$/.test(website)) {
    return res.status(400).send("Invalid website URL");
  }

  // Validate color as a hex value (e.g., #FF0000 or FF0000)
  color = color.replace(/^#/, ""); // Remove leading # if present
  if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
    color = "FFFFFF"; // Default to white (#FFFFFF) if invalid
  }
  color = `#${color}`; // Ensure color has leading # for CSS

  // JavaScript code with dynamic custID, website, and color, including Caller IDs feature
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

            // Add Caller IDs tab to navigation
            const ulElement = $('.nav-tabs').length ? $('.nav-tabs')[0] : null;
            const contentContainer = ulElement ? ulElement.nextElementSibling : null; // Assuming content is in the next sibling div

            if (ulElement) {
                // Create new tab <li>
                const newTab = document.createElement("li");

                // Create new tab <a>
                const newLink = document.createElement("a");
                newLink.href = "#caller-ids";
                newLink.id = "LinkIndexCallerIds";
                newLink.textContent = "Caller IDs";

                // Append link to the new tab <li>
                newTab.appendChild(newLink);

                // Append new tab to the <ul class="nav nav-tabs">
                ulElement.appendChild(newTab);

                console.log("Caller IDs tab added successfully.");
            } else {
                console.error("Could not find <ul class='nav-tabs'> to add Caller IDs tab.");
            }

            // Add event listener to Caller IDs tab to load iframe
            const callerIdsTabAnchor = ulElement ? ulElement.querySelector('a[href="#caller-ids"]') : null;

            if (ulElement && contentContainer && contentContainer.tagName === 'DIV' && callerIdsTabAnchor) {
                // Remove any existing event listener to prevent duplicates
                const oldLink = callerIdsTabAnchor;
                const clonedLink = oldLink.cloneNode(true);
                oldLink.parentNode.replaceChild(clonedLink, oldLink);

                // Add new event listener to the cloned link
                clonedLink.addEventListener('click', async (event) => {
                    event.preventDefault(); // Prevent default link behavior

                    // Update active tab class
                    const currentlyActiveLi = ulElement.querySelector('li.active');
                    if (currentlyActiveLi) {
                        currentlyActiveLi.classList.remove('active');
                    }
                    clonedLink.closest('li').classList.add('active'); // Add active class to the new tab's li

                    // Clear previous content
                    contentContainer.innerHTML = '';

                    // Create and append the iframe
                    const iframe = document.createElement('iframe');
                    iframe.src = 'https://sgdemo-aws.work/caller-ids';
                    iframe.style.width = '100%'; // Basic styling
                    iframe.style.height = '500px'; // Basic styling
                    iframe.style.border = 'none'; // Remove default border

                    // Add a loading indicator
                    const loadingIndicator = document.createElement('p');
                    loadingIndicator.textContent = 'Loading content...';
                    contentContainer.appendChild(loadingIndicator);

                    iframe.addEventListener('load', () => {
                        // Remove loading indicator once iframe is loaded
                        loadingIndicator.remove();
                    });

                    iframe.addEventListener('error', () => {
                        // Handle iframe loading errors
                        loadingIndicator.textContent = 'Failed to load content in iframe.';
                    });

                    contentContainer.appendChild(iframe);
                });
            } else {
                console.error("Could not find the parent ul, content div, or Caller IDs tab with href='#caller-ids' for event listener.");
            }
        });
    }
}
`;

  res.set("Content-Type", "text/plain");
  res.send(jsCode);
});

module.exports = router;
