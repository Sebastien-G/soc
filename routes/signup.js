var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');


router.post('/', function(req, res, next) {
  User.register(new User({
    username: req.body.username
  }),
  req.body.password, function(err, account) {
    if (err) {
      console.log(err);
      return res.render('signup', {
        title: 'Créer un compte',
        signupErrors: {
          'usernameTaken': 'Ce nom d’utilisateur est déjà pris'
        }
      });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  });
});

module.exports = router;
