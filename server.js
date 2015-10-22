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

/***************************************************************
** Using Promises to break up the fs access & readFile methods
****************************************************************/

let fileAccess = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, (error) => {
      if (!error) {
        resolve(filepath);
      } else {
        reject(error);
      }
    });
  });
};

let fileStreamer = (filepath) => {
  return new Promise((resolve, reject) => {

    // creating a stream
    let fileStream = fs.createReadStream(filepath);

    // listening for the open event
    fileStream.on('open', () => {
      resolve(fileStream);
    });

    // listening for the error event
    fileStream.on('error', () => {
      reject(error);
    });

  });
};

let staticServer = (req, res) => {

  // Getting the URL {}
  let baseURI = url.parse(req.url);

  // Getting the file path
  // if route reqest is '/', then load 'index.html'
  // else use whatever route request is given
  let filePath = __dirname + (baseURI.pathname === '/' ?  '/index.html' : baseURI.pathname);

  // getting the content-type by using file extension from file
  let contentType = contentTypes[path.extname(filePath)];

  console.log('Requst URL: ', req.url);
  console.log('File Extension: ', path.extname(filePath))
  console.log('Content Type: ', contentType);
  console.log('File Location: ', filePath);
  console.log('\n');

  // invoke the fileAccess() with the filePath var to start the Promise
  fileAccess(filePath) // if resolve invoke fileReader & pass filePath
    .then(fileStreamer) // if resolve return the content
    .then((fileStream) => {
      res.writeHead(200, {'Content-type': contentType});
      // res.end(content, 'utf-8');
      fileStream.pipe(res);
    })
    .catch((error) => {
      res.writeHead(404);
      res.end(JSON.stringify(error));
    });
};

// Server
http.createServer(staticServer).listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
