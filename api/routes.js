//middleware to perform routes
var router = require('express').Router();

//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '/parsers/resources'));

//default route: show index.ejs
router.get('/', function (request, response) {

    resources.getString('app_name', function(err, value) {

        //set webpage title with app_name (@see res/strings.xml)
        response.render(path.join(__dirname, '/views/index.ejs'), { title: value });
    });

});

router.post('/phones/', function (request, response) {

    console.log('try to retrieve all phones depending user credentials');

    if(request.body.email == 'hivinau.graffe@hotmail.fr' && request.body.password == 'test') {


        console.log('phones registered by ' + request.body.email + ' are listed');

        var phones = [ { type: 'android' } ];
        response.render(path.join(__dirname, '/views/fragments/phones.ejs'), { phones: phones });

    } else {

        var error = 'unable to authenticate user with specified credentials';

        console.log(error);

        response.statusCode = 522;
        response.send({ error: error });
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

//set app routes
module.exports = router;

