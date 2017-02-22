//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

var serverSocket = module.exports = function (server) {

    io = require('socket.io')(server);
};

serverSocket.start = function () {

    io.on('connection', function(socket) {

        resources.stringValueOf('socket_connected', function(err, value) {

            console.log(value);
        });

        socket.on('authentication', function (data) {

            resources.stringValueOf('authenticating', function(err, value) {

                console.log(value, socket.id);
            });

            if(data.hasOwnProperty('email') && data.hasOwnProperty('password')) {

                var credentials = require(path.join(__dirname, '../database-managers/credentials.js'));

                credentials.list(function (error, items) {

                    if(error) {

                        resources.stringValueOf('authentication_failed', function(err, value) {

                            console.log(value);
                            socket.emit('credentials refused', value);
                        });

                    } else {

                        var exists = false;

                        items.forEach(function (item, index) {

                            if(item.email == data.email && item.password == data.password) {

                                exists = true;
                            }
                        });

                        if(exists) {

                            resources.stringValueOf('authentication_succeed', function(err, value) {

                                console.log(value, socket.id);
                                socket.emit('credentials accepted');
                            });

                        } else {

                            resources.stringValueOf('authentication_failed', function(err, value) {

                                console.log(value);
                                socket.emit('credentials refused', value);
                            });
                        }
                    }
                });

            } else {

                resources.stringValueOf('authentication_failed', function(err, value) {

                    console.log(value);
                    socket.emit('credentials refused', value);
                });
            }
        });

        socket.on('disconnect', function() {

            resources.stringValueOf('socket_disconnected', function(err, value) {

                console.log(value);
            });
        });

    });
};

serverSocket.emit = function (event, data) {

    io.emit(event, data);
};