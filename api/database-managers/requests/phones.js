//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../../parsers/resources.js'));

//app configuration properties
var config = require(path.join(__dirname, '../../security/config.js'));

//database connectors
var credentials = require(path.join(__dirname, '../credentials.js'));
var phones = require(path.join(__dirname, '../phones.js'));

//connector to send 'data available' event to sockets
var serverSocket = require(path.join(__dirname, '../../security/server-socket.js'));

module.exports = {

    add: function (request, response) {

        resources.stringValueOf('add_phone', function(err, value) {

            console.log(value);
        });

        if(request.body.email && request.body.password) {

            credentials.verify(request.body.email, request.body.password, function (exists) {

                if(exists) {

                    phones.add(request.body.email, function (error, data) {

                        if(error) {

                            console.log(error);

                            response.statusCode = config.statusCode.adding_phone_failed;
                            response.send({ error: error });

                        } else {

                            resources.stringValueOf('add_phone_succeed', function(err, value) {

                                console.log(value, data.token);
                            });

                            response.send({ 'expired-at' : new Date(data.expiredAt).toString(), 'token': data.token });

                            var data = { 'phone' :
                                {
                                    'email': request.body.email,
                                    'token': request.body.token
                                }
                            };

                            serverSocket.emit('data available', data);

                        }
                    })

                } else {

                    resources.stringValueOf('add_phone_failed', function(err, value) {

                        console.log(value);

                        response.statusCode = config.statusCode.adding_phone_failed;
                        response.send({ 'error': value });
                    });
                }
            });

        } else {

            resources.stringValueOf('add_phone_failed', function(err, value) {

                console.log(value);

                response.statusCode = config.statusCode.adding_phone_failed;
                response.send({ 'error': value });
            });
        }
    },

    remove: function (request, response) {

        resources.stringValueOf('remove_phone', function(err, value) {

            console.log(value);
        });

        if(request.body.email && request.body.token) {

            phones.remove(request.body.token, function (removed) {

                if(removed) {

                    resources.stringValueOf('remove_phone_succeed', function(err, value) {

                        console.log(value);

                        response.send({ 'result': value });
                    });

                    var data = { 'phone' :
                        {
                            'email': request.body.email,
                            'token': request.body.token
                        }
                    };

                    serverSocket.emit('data available', data);

                } else {

                    resources.stringValueOf('remove_phone_failed', function(err, value) {

                        console.log(value);

                        response.statusCode = config.statusCode.removing_phone_failed;
                        response.send({ 'error': value });
                    });
                }
            });

        } else {

            resources.stringValueOf('remove_phone_failed', function(err, value) {

                console.log(value);

                response.statusCode = config.statusCode.removing_phone_failed;
                response.send({ 'error': value });
            });
        }
    },

    list: function (request, response) {

        resources.stringValueOf('retrieve_phones', function(err, value) {

            console.log(value);
        });

        if(request.body.email && request.body.password) {

            credentials.verify(request.body.email, request.body.password, function (exists) {

                if(exists) {

                    phones.validatedList(request.body.email, function (error, items) {

                        if(items) {

                            resources.stringValueOf('retrieve_phones_succeed', function(err, value) {

                                console.log(value, items.length, request.body.email);

                                response.render(path.join(__dirname, '../../views/fragments/phones.ejs'), { phones: items });
                            });
                        } else {

                            resources.stringValueOf('retrieve_phones_failed', function(err, value) {

                                console.log(value);

                                response.statusCode = config.statusCode.listing_phone_failed;
                                response.send({ 'error': value });
                            });
                        }
                    });
                } else {

                    resources.stringValueOf('retrieve_phones_failed', function(err, value) {

                        console.log(value);

                        response.statusCode = config.statusCode.listing_phone_failed;
                        response.send({ 'error': value });
                    });
                }
            });

        } else {

            resources.stringValueOf('retrieve_phones_failed', function(err, value) {

                console.log(value);

                response.statusCode = config.statusCode.listing_phone_failed;
                response.send({ 'error': value });
            });
        }
    }
};