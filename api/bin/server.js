var app = require('../app');
var http = require('http');

var server = http.createServer(app);

server.on('close', function() {

    console.log('Server closed');
});

server.listen(8080);
