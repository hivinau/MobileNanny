//middleware to perform routes
var router = module.exports = require('express').Router();

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '/parsers/resources'));

var statusCodes = {

    USER_ADD_FAILED: 520,
    PHONES_LISTING_FAILED: 521
};

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

        var credentialsManager = require(path.join(__dirname, '/database-managers/credentials-manager.js'));

        credentialsManager.add(request.body.email, request.body.password, function (error, results) {

            if(error) {

                console.log(error);

                response.statusCode = statusCodes.USER_ADD_FAILED;
                response.send({ error: error });

            } else {

                console.log(results);
                response.send({ result: results });
            }
        });
    } else {

        resources.stringValueOf('user_add_failed', function(err, value) {

            console.log(value);

            response.statusCode = statusCodes.USER_ADD_FAILED;
            response.send({ error: value });
        });
    }
});

router.post('/phones/list/', function (request, response) {

    resources.stringValueOf('retrieve_phones', function(err, value) {

        console.log(value);
    });

    if(request.body.email == 'hivinau.graffe@hotmail.fr' && request.body.password == 'test') {

        resources.stringValueOf('retrieve_phones_succeed', function(err, value) {

            console.log(value, request.body.email);
        });

        var phones = [ { type: 'android' } ];
        response.render(path.join(__dirname, '/views/fragments/phones.ejs'), { phones: phones });

    } else {

        resources.stringValueOf('retrieve_phones_failed', function(err, value) {

            console.log(value);

            response.statusCode = statusCodes.PHONES_LISTING_FAILED;
            response.send({ error: value });
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

