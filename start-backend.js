const path = require('path');
const fs = require('fs');

const envPath = path.join(__dirname, '..', 'backend', '.env');
const serverPath = path.join(__dirname, '..', 'backend', 'server.js');

console.log('--- LINSFAIR Backend Bootstrapper ---');
console.log('Environment path:', envPath);
console.log('Server path:', serverPath);

if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env file not found at', envPath);
    process.exit(1);
}

if (!fs.existsSync(serverPath)) {
    console.error('ERROR: server.js not found at', serverPath);
    process.exit(1);
}

try {
    const dotenv = require('../backend/node_modules/dotenv');
    dotenv.config({ path: envPath });
    console.log('Environment variables loaded.');
    console.log('Starting server...');
    require(serverPath);
} catch (err) {
    console.error('CRITICAL ERROR during startup:', err);
    process.exit(1);
}
