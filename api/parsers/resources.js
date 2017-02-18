var resources = {

    getString: function(tag, callback) {

        var fs = require('fs');
        var xml2js = require('xml2js');

        var parser = new xml2js.Parser();

        var file = fs.readFileSync('./res/strings.xml', 'utf8');
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
    }
};

module.exports = resources;