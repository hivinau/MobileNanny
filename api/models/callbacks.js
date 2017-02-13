var fs = require('fs');
var ejs = require('ejs');
var globals = require('./globals.js');

var callbacks = {
    
    throw404Error: function(request, response, next) { //handle error 404
        
        var error = new Error('Not Found');
        error.status = 404;
        
        next(error); //throw error to page error.ejs
    },

    throwError: function(error, request, response, next) {

        //load page error.ejs
        var file = fs.readFileSync('./views/pages/error.ejs', 'utf8')
        var template = ejs.compile(file); //compile string into template function

        var content = template({ //pass error message to variable 'error' on page error.ejs

            error: error.message
        });

        response.status(error.status || 500);
        response.render(globals.render.layout, {

            content: content //pass content to variable 'content' on layout.ejs
        });
    }
};

module.exports = callbacks;