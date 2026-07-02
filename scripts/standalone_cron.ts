/**
 * standalone_cron.ts
 *
 * TypeScript version of the standalone cron script that pings the
 * Next.js API route on a schedule.
 *
 * Run with: `npx ts-node scripts/standalone_cron.ts` (for quick testing)
 * Or compile with `tsc` and run the emitted JS with `node`.
 */

import * as cron from 'node-cron';
import http, { IncomingMessage } from 'http';

const TARGET_URL = 'http://localhost:3000/api/cron/send-birthdays';
// Run daily at 10:45 (server timezone: Asia/Karachi)
const CRON_SCHEDULE = '45 10 * * *';

console.log('🚀 TypeScript standalone cron started...');
console.log(`[Cron] Will hit: ${TARGET_URL}`);
console.log(`[Cron] Schedule: ${CRON_SCHEDULE} (daily at 10:45)`);

function triggerApi(): void {
  console.log(`\n🔥 [Cron] Triggering at ${new Date().toLocaleString()}`);

  http.get(TARGET_URL, (res: IncomingMessage) => {
    let data = '';

    res.on('data', (chunk: Buffer | string) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`✅ [Cron] API Response: ${data}`);
    });

  }).on('error', (err: Error) => {
    console.error(`❌ [Cron] Error: ${err.message}`);
    console.error('👉 Make sure Next.js server is running on port 3000');
  });
}

cron.schedule(CRON_SCHEDULE, () => {
  console.log('⏰ Cron fired!');
  triggerApi();
}, {
  timezone: 'Asia/Karachi'
});

console.log('⚡ Running first trigger manually...');
triggerApi();

setInterval(() => {
  console.log(' Cron still running...');
}, 60000);
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

// const cron = require('node-cron');
// const http = require('http'); // or 'https' if your local server uses HTTPS

// // The URL to your Next.js API route that handles the actual birthday logic
// const TARGET_URL = 'http://localhost:3000/api/cron/send-birthdays';

// // Set the time you want the cron job to run every day. 
// // Format: "Minute Hour * * *"
// // "0 10 * * *" means 10:00 AM every day
// const CRON_SCHEDULE = '* * * * *';

// console.log(`[Standalone Cron] Service started. Scheduled to ping ${TARGET_URL} at schedule: "${CRON_SCHEDULE}"`);

// cron.schedule(CRON_SCHEDULE, () => {
//     console.log(`[Standalone Cron] Triggering birthday job at ${new Date().toISOString()}`);

//     http.get(TARGET_URL, (res) => {
//         let data = '';

//         // A chunk of data has been received.
//         res.on('data', (chunk) => {
//             data += chunk;
//         });

//         // The whole response has been received.
//         res.on('end', () => {
//             console.log(`[Standalone Cron] Next.js Server Response: ${data}`);
//         });

//     }).on("error", (err) => {
//         console.error(`[Standalone Cron] ❌ Error triggering Next.js job: ${err.message}`);
//         console.error(`Make sure your Next.js server is actively running on port 3000!`);
//     });
// });


/**
 * standalone_cron.js
 * Fully working debug version
 */

// const cron = require('node-cron');
// const http = require('http');

// const TARGET_URL = 'http://localhost:3000/api/cron/send-birthdays';

// // 🔥 Run every minute for testing
// const CRON_SCHEDULE = '* * * * *';

// console.log("🚀 Script started...");
// console.log(`[Cron] Will hit: ${TARGET_URL}`);
// console.log(`[Cron] Schedule: ${CRON_SCHEDULE}`);

// // ✅ Function to call API
// function triggerApi() {
//     console.log(`\n🔥 [Cron] Triggering at ${new Date().toLocaleString()}`);

//     http.get(TARGET_URL, (res) => {
//         let data = '';

//         res.on('data', (chunk) => {
//             data += chunk;
//         });

//         res.on('end', () => {
//             console.log(`✅ [Cron] API Response: ${data}`);
//         });

//     }).on("error", (err) => {
//         console.error(`❌ [Cron] Error: ${err.message}`);
//         console.error("👉 Make sure Next.js server is running on port 3000");
//     });
// }

// // ✅ Schedule cron job
// cron.schedule(CRON_SCHEDULE, () => {
//     console.log("⏰ Cron fired!");
//     triggerApi();
// }, {
//     timezone: "Asia/Karachi"
// });

// // ✅ 🔥 MANUAL TRIGGER (runs immediately on start)
// console.log("⚡ Running first trigger manually...");
// triggerApi();

// // ✅ Keep process alive check
// setInterval(() => {
//     console.log(" Cron still running...");
// }, 60000);