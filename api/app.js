//> npm install ### install modules defined on package.json
//> npm start ### launch app server

var express = require('express');

//middleware to format url basename
var path = require('path');

//middleware to parse http request format message
var bodyParser = require('body-parser');

//set server listener
var app = module.exports = express();

// parse request header with content-type: application/json
app.use(bodyParser.json());

//all routes are defined on routes.js
app.use(require(path.join(__dirname, 'routes.js')));

//clients can access to 'public' folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/data/gpx.xml', express.static(path.join(__dirname, '/data/gpx.xml')));