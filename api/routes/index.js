var globals = require('../models/globals.js');
var fs = require('fs');
var ejs = require('ejs');
var resources = require('../parsers/resources');
var router = require('express').Router();

router.get(globals.routes.root, function(request, response, next) {

    resources.getString('app_name', function(err, value) {

        console.log('Loading page for route \'' + globals.routes.root + '\'');

        //load page 'map-viewer.ejs'
        var map = fs.readFileSync('./views/pages/map-viewer.ejs', 'utf8');

        //retrieve parameters on page 'map-viewer.ejs' as app_title
        var parameters = ejs.compile(map);

        var content = parameters({

            app_title: value
        });

        //render parameters on main layout
        response.render(globals.render.layout, { title: value, content: content });
    });
});

module.exports = router;