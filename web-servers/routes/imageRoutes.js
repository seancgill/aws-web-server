const express = require('express');
const path = require('path');
const router = express.Router();

// Serve static image files from the 'images' directory
router.use('/images', express.static(path.join(__dirname, '../images'), {
    // Optional: Set headers for caching
    setHeaders: (res, filePath) => {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        res.setHeader('Content-Type', getContentType(filePath)); // Set correct MIME type
    }
}));

// Helper function to determine MIME type based on file extension
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

// Optional: Custom route for specific image by name with validation
router.get('/image/:imageName', (req, res) => {
    const imageName = req.params.imageName;

    // Validate image name to prevent path traversal
    if (!/^[a-zA-Z0-9_-]+\.(png|jpg|jpeg|gif|svg)$/.test(imageName)) {
        return res.status(400).send('Invalid image name');
    }

    const imagePath = path.join(__dirname, '../images', imageName);

    // Check if file exists
    if (!require('fs').existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }

    // Serve the image with proper headers
    res.sendFile(imagePath, {
        headers: {
            'Cache-Control': 'public, max-age=31536000',
            'Content-Type': getContentType(imageName)
        }
    });
});

module.exports = router;
