//middleware to perform routes
var router = module.exports = require('express').Router();

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '/parsers/resources'));

//app configuration properties
var config = require(path.join(__dirname, '/security/config.js'));

//database connectors
var credentials = require(path.join(__dirname, '/database-managers/credentials.js'));
var phones = require(path.join(__dirname, '/database-managers/phones.js'));

//default route: show index.ejs
router.get('/', function (request, response) {

    resources.stringValueOf('app_name', function(err, value) {

        //set webpage title with app_name (@see res/strings.xml)
        response.render(path.join(__dirname, '/views/index.ejs'), { title: value });
    });

});

router.post('/users/add/', function (request, response) {

    resources.stringValueOf('add_user', function(err, value) {

        console.log(value);
    });

    if(request.body.email && request.body.password) {

        credentials.add(request.body.email, request.body.password, function (error, results) {

            if(error) {

                console.log(error);

                response.statusCode = config.statusCode.adding_user_failed;
                response.send({ 'error': error });

            } else {

                console.log(results);
                response.send({ 'result': results });
            }
        });
    } else {

        resources.stringValueOf('user_add_failed', function(err, value) {

            console.log(value);

            response.statusCode = config.statusCode.adding_user_failed;
            response.send({ 'error': value });
        });
    }
});

router.post('/phones/list/', function (request, response) {

    resources.stringValueOf('retrieve_phones', function(err, value) {

        console.log(value);
    });

    if(request.body.email && request.body.password) {

        credentials.verify(request.body.email, request.body.password, function (exists) {

            if(exists) {

                phones.list(request.body.email, function (error, items) {

                    if(items) {

                        resources.stringValueOf('retrieve_phones_succeed', function(err, value) {

                            console.log(value, items.length, request.body.email);

                            response.render(path.join(__dirname, '/views/fragments/phones.ejs'), { phones: items });
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
});

router.post('/phones/add/', function (request, response) {

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
});

//404 redirection: call error redirection
router.use(function (request, response, next) {

    next();
});

//error redirection
router.use(function (error, request, response, next) {

    response.redirect('/');
});

