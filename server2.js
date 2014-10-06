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

  var unhandledError = function() {
    res.writeHead(500, 'Unhandled Error', { 'content-type': 'text/html' });
    res.write('<h1>Unhandled Error</h1>');
    res.end();
  };

  var notFound = function() {
    res.writeHead(404, 'Not Found', { 'content-type': 'text/html' });
    res.write('<h1>Not Found</h1>');
    res.end();
  };

  if (filePath.indexOf(basePath) === 0) {
    res.writeHead(200, { 'content-type': 'text/html' });
    fs.createReadStream(filePath)
      .on('error', unhandledError)
      .pipe(res);
  }
  else { notFound(); }
});
server.listen(portNumber);
