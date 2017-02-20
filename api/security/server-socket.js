//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../parsers/resources'));

var serverSocket = function (server) {

    var io = require('socket.io')(server);

    io.on('connection', function(socket) {

        resources.getString('socket_connected', function(err, value) {

            console.log(value);
        });

        socket.on('authentication', function (credentials) {

            resources.getString('authenticating', function(err, value) {

                console.log(value, socket.id);
            });

            if(credentials.hasOwnProperty('email') && credentials.hasOwnProperty('password')) {

                var credentialsManager = require(path.join(__dirname, '../database-managers/credentials-manager.js'));

                credentialsManager.list(function (error, items) {

                    if(error) {

                        resources.getString('authentication_failed', function(err, value) {

                            console.log(value);
                            socket.emit('credentials refused', value);
                        });

                    } else {

                        var exists = false;

                        items.forEach(function (item, index) {

                            if(item.email == credentials.email && item.password == credentials.password) {

                                exists = true;
                            }
                        });

                        if(exists) {

                            resources.getString('authentication_succeed', function(err, value) {

                                console.log(value, socket.id);
                                socket.emit('credentials accepted');
                            });

                        } else {

                            resources.getString('authentication_failed', function(err, value) {

                                console.log(value);
                                socket.emit('credentials refused', value);
                            });
                        }
                    }
                });

            } else {

                resources.getString('authentication_failed', function(err, value) {

                    console.log(value);
                    socket.emit('credentials refused', value);
                });
            }
        });

        socket.on('disconnect', function() {

            resources.getString('socket_disconnected', function(err, value) {

                console.log(value);
            });
        });

    });
};

module.exports = serverSocket;