//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../../parsers/resources.js'));

//app configuration properties
var config = require(path.join(__dirname, '../../security/config.js'));

//database connectors
var credentials = require(path.join(__dirname, '../credentials.js'));

module.exports = {

    add: function (request, response) {

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
    }
};