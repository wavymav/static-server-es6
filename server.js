'use strict';

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Content mime types
const contentTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg'
}

let staticServer = (req, res) => {

  // Getting the URL {}
  let baseURI = url.parse(req.url);
  // Getting the file path
  // if route reqest is '/', then load 'index.html'
  // else use whatever route request is given
  let filePath = __dirname + (baseURI.pathname === '/' ?  '/index.html' : baseURI.pathname);
  console.log(filePath);
  console.log(req.url);

  // Checking if the file is accessable by checking if the filepath is available
  // callback checks for errors
  fs.access(filePath, fs.F_OK, (error) => {
    if(!error) {
      // Read and Serve files
      fs.readFile(filePath, (error, content) => {
        if (!error) {
          // getting the content-type by using file extension from file
          let contentType = contentTypes[path.extname(filePath)];

          // Serving the file with the correct content-type
          res.writeHead(200, {'Content-type': contentType});
          res.end(content, 'utf-8');
        } else {
          res.writeHead(500);
          res.end('Server could not read the file')
        }
      });
    } else {
      res.writeHead(404);
      res.end('Content DNE!');
    }
  });
}

// Server
http.createServer(staticServer).listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
