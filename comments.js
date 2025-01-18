// Create web server and listen on port 3000.
const http = require('http');
const fs = require('fs');
const url = require('url');
const comments = require('./comments.json');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  if (path === '/comments' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    return res.end(JSON.stringify(comments));
  }

  if (path === '/comments' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const parsedBody = JSON.parse(body);
      comments.push(parsedBody);
      fs.writeFileSync('./comments.json', JSON.stringify(comments, null, 2));
      res.writeHead(201, {
        'Content-Type': 'application/json'
      });
      return res.end(JSON.stringify(parsedBody));
    });
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});