const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

// Directory for log files
const logsDir = '/home/ubuntu/web-servers/ns_logs';

// Helper function to get file or directory details
async function getItems(dir, basePath = '') {
    console.log(`[LIST] Reading directory: ${dir}`);
    try {
        const items = await fs.readdir(dir, { withFileTypes: true });
        const itemDetails = [];

        for (const item of items) {
            const itemName = item.name;
            const itemPath = path.join(dir, itemName);
            const relativePath = path.join(basePath, itemName).replace(/\\/g, '/');

            try {
                const stats = await fs.stat(itemPath);

                if (item.isFile()) {
                    itemDetails.push({
                        type: 'file',
                        name: itemName,
                        size: (stats.size / 1024).toFixed(2) + ' KB',
                        modified: stats.mtime.toISOString().split('T')[0],
                        filePath: itemPath,
                        viewUrl: `/logs/view/${relativePath}`,
                        downloadUrl: `/logs/download/${relativePath}`
                    });
                } else if (item.isDirectory()) {
                    itemDetails.push({
                        type: 'directory',
                        name: itemName,
                        size: '-',
                        modified: stats.mtime.toISOString().split('T')[0],
                        viewUrl: `/logs/${relativePath}`,
                        downloadUrl: null
                    });
                }
            } catch (err) {
                console.error(`[LIST] Error stating ${itemPath}:`, err.message);
            }
        }
        return itemDetails;
    } catch (err) {
        console.error(`[LIST] Error reading directory ${dir}:`, err.message);
        return [];
    }
}

// Route to download a log file
router.get('/download/:subPath(.+)', async (req, res) => {
    const subPath = req.params.subPath || '';
    const fileName = path.basename(subPath);
    const filePath = path.join(logsDir, subPath);

    console.log(`[DOWNLOAD] SubPath: ${subPath}, FileName: ${fileName}, FilePath: ${filePath}`);

    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
        console.error(`[DOWNLOAD] Invalid file name: ${fileName}`);
        return res.status(400).send('Invalid file name');
    }

    try {
        const stats = await fs.stat(filePath);
        console.log(`[DOWNLOAD] File stats: isFile=${stats.isFile()}, size=${stats.size}`);
        if (!stats.isFile()) {
            console.error(`[DOWNLOAD] Not a file: ${filePath}`);
            return res.status(400).send('Not a file');
        }
        await fs.access(filePath, fs.constants.R_OK);
        console.log(`[DOWNLOAD] File ${filePath} is accessible`);
        res.sendFile(filePath, {
            headers: { 'Content-Disposition': `attachment; filename="${fileName}"` }
        }, (err) => {
            if (err) {
                console.error(`[DOWNLOAD] Error sending file ${filePath}:`, err.message, err.stack);
                if (!res.headersSent) {
                    res.status(500).send('Error downloading file');
                }
            } else {
                console.log(`[DOWNLOAD] File ${filePath} sent successfully`);
            }
        });
    } catch (err) {
        console.error(`[DOWNLOAD] Error accessing file ${filePath}:`, err.message, err.stack);
        res.status(404).send('File not found');
    }
});

// Route to view a log file
router.get('/view/:subPath(.+)', async (req, res) => {
    const subPath = req.params.subPath || '';
    const fileName = path.basename(subPath);

    console.log(`[VIEW] SubPath: ${subPath}, FileName: ${fileName}`);

    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
        console.error(`[VIEW] Invalid file name: ${fileName}`);
        return res.status(400).send('Invalid file name');
    }

    const filePath = path.join(logsDir, subPath);
    console.log(`[VIEW] FilePath: ${filePath}`);

    try {
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) {
            console.error(`[VIEW] Not a file: ${filePath}`);
            return res.status(400).send('Not a file');
        }
        await fs.access(filePath, fs.constants.R_OK);
        const content = await fs.readFile(filePath, 'utf8');
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>View Log: ${fileName}</title>
                <style>
                    body { font-family: monospace; margin: 20px; white-space: pre-wrap; }
                    a { color: #0066cc; }
                </style>
            </head>
            <body>
                <h1>Log File: ${fileName}</h1>
                <a href="/logs/${path.dirname(subPath).replace(/\\/g, '/')}">Back to ${path.dirname(subPath) === '.' ? 'Logs' : path.dirname(subPath)}</a>
                <hr>
                ${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </body>
            </html>
        `);
    } catch (err) {
        console.error(`[VIEW] Error reading file ${filePath}:`, err.message, err.stack);
        res.status(404).send('File not found');
    }
});

// Explicit route for /logs
router.get('/', async (req, res) => {
    console.log('[LIST] Explicit /logs route hit');
    const currentDir = logsDir;
    try {
        await fs.access(currentDir, fs.constants.R_OK);
        console.log(`[LIST] Directory ${currentDir} is accessible`);
        const items = await getItems(currentDir, '');
        const breadcrumbHtml = '<a href="/logs">Logs</a>';
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Log Files</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    a { color: #0066cc; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .breadcrumbs { margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>Log Files</h1>
                <div class="breadcrumbs">${breadcrumbHtml}</div>
                <table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Size</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.type === 'directory' ? `[DIR] ${item.name}` : item.name}</td>
                                <td>${item.size}</td>
                                <td>${item.modified}</td>
                                <td>
                                    ${item.viewUrl ? `<a href="${item.viewUrl}">${item.type === 'directory' ? 'Open' : 'View'}</a>` : ''}
                                    ${item.downloadUrl ? ` | <a href="${item.downloadUrl}" download>Download</a>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    } catch (err) {
        console.error(`[LIST] Error accessing directory ${currentDir}:`, err.message, err.stack);
        res.status(404).send(`Directory not found: ${err.message}`);
    }
});

// Route to display log files and directories UI
router.get('/:subPath*', async (req, res) => {
    console.log(`[LIST] Route hit for /logs with subPath: ${req.params.subPath || 'empty'}`);
    console.log(`[LIST] Full params:`, req.params);
    const subPath = req.params.subPath || '';
    const currentDir = path.join(logsDir, subPath);

    console.log(`[LIST] Accessing directory: ${currentDir}`);
    console.log(`[LIST] Base logsDir: ${logsDir}`);

    try {
        await fs.access(currentDir, fs.constants.R_OK);
        console.log(`[LIST] Directory ${currentDir} is accessible`);
        const items = await getItems(currentDir, subPath);

        console.log(`[LIST] Items retrieved:`, items.map(item => item.name));

        const breadcrumbs = subPath.split('/').filter(p => p);
        let breadcrumbHtml = '<a href="/logs">Logs</a>';
        let currentPath = '';
        for (const part of breadcrumbs) {
            currentPath += `/${part}`;
            breadcrumbHtml += ` / <a href="/logs${currentPath}">${part}</a>`;
        }

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Log Files${subPath ? `: ${subPath}` : ''}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    a { color: #0066cc; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .breadcrumbs { margin-bottom: 10px; }
                </style>
            </head>
            <body>
                <h1>Log Files${subPath ? `: ${subPath}` : ''}</h1>
                <div class="breadcrumbs">${breadcrumbHtml}</div>
                <table>
                    <thead>
                        <tr>
                            <th>File Name</th>
                            <th>Size</th>
                            <th>Last Modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.type === 'directory' ? `[DIR] ${item.name}` : item.name}</td>
                                <td>${item.size}</td>
                                <td>${item.modified}</td>
                                <td>
                                    ${item.viewUrl ? `<a href="${item.viewUrl}">${item.type === 'directory' ? 'Open' : 'View'}</a>` : ''}
                                    ${item.downloadUrl ? ` | <a href="${item.downloadUrl}" download>Download</a>` : ''}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `);
    } catch (err) {
        console.error(`[LIST] Error accessing directory ${currentDir}:`, err.message, err.stack);
        res.status(404).send(`Directory not found: ${err.message}`);
    }
});

module.exports = router;
