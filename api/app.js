//> npm start ### CLI to launch app

var globals = require('./models/globals.js');
var callbacks = require('./models/callbacks.js');
var express = require('express');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

var app = express();

app.set('views', path.join(__dirname, globals.path.views));
app.set('view engine', 'ejs');

//tell app that folder 'public' can be opened to client
app.use('/public', express.static(__dirname + '/public'));

//define routes
app.use(globals.routes.root, require('./routes/index'));

//define error callbacks
app.use(callbacks.throw404Error);
app.use(callbacks.throwError);

module.exports = app;