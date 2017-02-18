var globals = require('../models/globals.js');
var fs = require('fs');
var ejs = require('ejs');
var router = require('express').Router();

router.get(globals.routes.root, function(request, response, next) {

  console.log('Loading page for route \'' + globals.routes.root + '\'');

  //load page 'map-viewer.ejs'
  var map = fs.readFileSync('./views/pages/map-viewer.ejs', 'utf8');

  //retrieve parameters on page 'map-viewer.ejs' as app_title
  var parameters = ejs.compile(map);

  var title = 'Mobile Nanny';
  var content = parameters({

    app_title: title
  });

  //render parameters on main layout
  response.render(globals.render.layout, { title: title, content: content });

});

module.exports = router;