var express = require('express');
var router = express.Router();
var User = require('../models/user');
var utils = require('../lib/utils');


router.get('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {

    var obj = {
      title: 'Messagerie privée',
      req: req
    };

    res.render('messages', obj);

  } // auth
});


module.exports = router;
