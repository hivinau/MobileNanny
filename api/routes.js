//middleware to perform routes
var router = module.exports = require('express').Router();

//middleware to format url basename
var path = require('path');

var indexRequest = require(path.join(__dirname, '/database-managers/requests/index.js'));
var usersRequest = require(path.join(__dirname, '/database-managers/requests/users.js'));
var phonesRequest = require(path.join(__dirname, '/database-managers/requests/phones.js'));
var locationsRequest = require(path.join(__dirname, '/database-managers/requests/locations.js'));

router.get('/', indexRequest.default);
router.post('/users/add/', usersRequest.add);
router.post('/phones/add/', phonesRequest.add);
router.post('/phones/remove/', phonesRequest.remove);
router.post('/phones/list/', phonesRequest.list);
router.post('/locations/add/', locationsRequest.add);
router.post('/locations/list/', locationsRequest.list);

//404 redirection: call error redirection
router.use(function (request, response, next) {

    next();
});

//error redirection
router.use(function (error, request, response, next) {

    response.redirect('/');
});

