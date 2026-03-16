/**
 * standalone_cron.js
 * 
 * This is a standalone Node.js script designed to run alongside your Next.js application
 * on a local server. It uses `node-cron` to automatically trigger the Next.js API route
 * every day.
 * 
 * USAGE:
 * 1. Ensure you have pm2 installed (`npm install -g pm2`)
 * 2. Run: `pm2 start scripts/standalone_cron.js --name "spinwheel-cron"`
 * 3. Make sure to run `pm2 save` so it starts on system boot.
 */

const cron = require('node-cron');
const http = require('http'); // or 'https' if your local server uses HTTPS

// The URL to your Next.js API route that handles the actual birthday logic
const TARGET_URL = 'http://localhost:3000/api/cron/send-birthdays';

// Set the time you want the cron job to run every day. 
// Format: "Minute Hour * * *"
// "0 10 * * *" means 10:00 AM every day
const CRON_SCHEDULE = '20 11 * * *';

console.log(`[Standalone Cron] Service started. Scheduled to ping ${TARGET_URL} at schedule: "${CRON_SCHEDULE}"`);

cron.schedule(CRON_SCHEDULE, () => {
    console.log(`[Standalone Cron] Triggering birthday job at ${new Date().toISOString()}`);

    http.get(TARGET_URL, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
            console.log(`[Standalone Cron] Next.js Server Response: ${data}`);
        });

    }).on("error", (err) => {
        console.error(`[Standalone Cron] ❌ Error triggering Next.js job: ${err.message}`);
        console.error(`Make sure your Next.js server is actively running on port 3000!`);
    });
});
