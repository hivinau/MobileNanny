var resources = module.exports  = {};

//middleware to read file
var fs = require('fs');

//middleware to parse xml content
var xml2js = require('xml2js');

resources.stringValueOf = function(tag, callback) {

    var file = fs.readFileSync('./res/strings.xml', 'utf8');

    var parser = new xml2js.Parser();
    parser.parseString(file, function (err, result) {

        var strings = result.resources.string;

        var value = '';

        for(var i = 0; i < strings.length; i++) {

            if(strings[i]['$']['name'] == tag) {

                value = strings[i]['_'];

                break;
            }
        }

        callback(err, value);
    });
};