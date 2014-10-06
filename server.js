var fs = require('fs');
var path = require('path');
var http = require('http');

var portNumber = Number(process.argv[2]);
var basePath = process.argv[3];

var server = http.createServer(function(req, res) {
  console.log('%s %s:%s',
    req.method,
    req.connection.remoteAddress,
    req.url);

  var basePath = process.argv[3];
  var filePath = path.join(basePath, req.url);

  var serveFile = function() {
    if (filePath.indexOf(basePath) === 0) {
      res.writeHead(200, { 'content-type': 'text/html' });
      fs.createReadStream(filePath)
        .on('error', dispatchError)
        .pipe(res);
    }
    else { notFound(); }
  };

  var unhandledError = function(error) {
    console.log('Fatal error: %s', error);
    res.writeHead(500, 'Unhandled Error', { 'content-type': 'text/html' });
    res.write('<h1>Unhandled Error</h1>');
    res.end();
  };

  var notFound = function() {
    res.writeHead(404, 'Not Found', { 'content-type': 'text/html' });
    res.write('<h1>Not Found</h1>');
    res.end();
  };

  var dispatchError = function(error) {
    if (error.code === 'EISDIR') {
      filePath = path.join(filePath, 'index.html');
      serveFile();
    }
    else if (error.code === 'ENOENT') { notFound(error); }
    else { unhandledError(error); }
  };

  if (req.url === '/') {
    res.writeHead(302, 'Moved', { Location: '/home/' });
    res.end();
  }
  else {
    serveFile();
  }
});
server.listen(portNumber);
