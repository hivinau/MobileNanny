var globals = require('../models/globals.js');
var express = require('express');
var router = express.Router();

router.get(globals.route.root, function(request, response, next) {

  response.render(globals.render.layout, { content: "<p>Mobile Nanny</p>" });
});

module.exports = router;