var globals = require('./models/globals.js');
var callbacks = require('./models/callbacks.js');
var express = require('express');
var path = require('path');

var app = express();

app.set('views', path.join(__dirname, globals.path.views));
app.set('view engine', 'ejs');

//define routes
app.use('root', require('./routes/index'));

//define error callbacks
app.use(callbacks.throw404Error);
app.use(callbacks.throwError);

module.exports = app;