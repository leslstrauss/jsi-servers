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

  // this code is bad and opens your computer to
  // security vulnerabilities (any file on your
  // computer will be accessible to an attacker).
  var basePath = process.argv[3];
  var filePath = path.join(basePath, req.url);

  res.writeHead(200, { 'content-type': 'text/html' });
  fs.createReadStream(filePath).pipe(res);
});
server.listen(portNumber);
