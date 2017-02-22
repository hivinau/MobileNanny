//middleware to format url basename
var path = require('path');

//middleware to load resources from xml parser (string, integer, ...)
var resources = require(path.join(__dirname, '../../parsers/resources.js'));

module.exports = {

    default: function (request, response) {

        resources.stringValueOf('app_name', function(err, value) {

            //set webpage title with app_name (@see res/strings.xml)
            response.render(path.join(__dirname, '../../views/index.ejs'), { title: value });
        });
    }
};