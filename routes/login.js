var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/', passport.authenticate('local'), function(req, res) {
  res.redirect('/');
});

module.exports = router;
