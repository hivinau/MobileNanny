//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../../parsers/resources.js'));

//app configuration properties
var config = require(path.join(__dirname, '../../security/config.js'));

//database connectors
var locations = require(path.join(__dirname, '../locations.js'));

//connector to send 'data available' event to sockets
var serverSocket = require(path.join(__dirname, '../../security/server-socket.js'));

module.exports = {

    add: function (request, response) {

        resources.stringValueOf('add_location', function(err, value) {

            console.log(value);
        });

        if(request.body.token && request.body.latitude && request.body.longitude) {

            locations.add(request.body.token, request.body.latitude, request.body.longitude, function (result) {

                if(result) {

                    resources.stringValueOf('add_location_succeed', function(err, value) {

                        console.log(value);

                        response.send({ 'result': value });
                    });

                    var data = { 'location' :
                        {
                            'latitude': request.body.latitude,
                            'longitude': request.body.longitude
                        }
                    };

                    serverSocket.emit('data available', data);

                } else {

                    resources.stringValueOf('add_location_failed', function(err, value) {

                        console.log(value);

                        response.statusCode = config.statusCode.removing_phone_failed;
                        response.send({ 'error': value });
                    });
                }
            });

        } else {

            resources.stringValueOf('add_location_failed', function(err, value) {

                console.log(value);

                response.statusCode = config.statusCode.removing_phone_failed;
                response.send({ 'error': value });
            });
        }
    },

    list: function (request, response) {

        resources.stringValueOf('retrieve_locations', function(err, value) {

            console.log(value);
        });

        if(request.body.token) {

            locations.list(request.body.token, function (error, items) {

                if(items && items.length == 1) {

                    resources.stringValueOf('retrieve_locations_succeed', function(err, value) {

                        console.log(value);
                    });

                    response.send({ 'locations': items[0].tracks });

                } else {

                    resources.stringValueOf('retrieve_locations_failed', function(err, value) {

                        console.log(value);

                        response.statusCode = config.statusCode.listing_locations_failed;
                        response.send({ 'error': value });
                    });
                }
            })

        } else {

            resources.stringValueOf('retrieve_locations_failed', function(err, value) {

                console.log(value);

                response.statusCode = config.statusCode.listing_locations_failed;
                response.send({ 'error': value });
            });
        }
    }
};