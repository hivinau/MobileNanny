//middleware to use HTTP server/client
var http = require('http');

//middleware to format url basename
var path = require('path');

//load server with app as listener
var server = http.createServer(require(path.join(__dirname, '../app.js')));

//establish socket server
var serverSocket = require(path.join(__dirname, '../security/server-socket.js'));
serverSocket(server);

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

//server will bind clients on port 8080
var port = process.env.PORT || 8080;
server.listen(port, function () {

    resources.stringValueOf('server_listening_on_port', function(err, value) {

        console.log(value, port);
    });

});
