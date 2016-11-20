var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var utils = require('../lib/utils');


router.get('/', function(req, res) {

  if (req.user) {
    res.redirect('/user/' + req.user.uid);
  }

  var loginErrorMsg = req.flash('loginError');

  var obj = {
    title: 'Connexion',
    req: req
  };

  if (loginErrorMsg != '') {
    obj.loginErrorMsg = loginErrorMsg
  }
  res.render('pages/public/login', obj);
});
/*
router.post('/', passport.authenticate('local'), function(req, res) {
  res.redirect('/?fucked=1');
});
*/

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('loginError', 'Nom d’utilisateur ou mot de passe incorrect.');
      return res.redirect('/login');
    } else {

      if (user.confirmed === false) {
        req.flash('loginError', 'Veuillez confirmer votre compte.');
        return res.redirect('/login');
      } else {
        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }

          return res.redirect('/');
        });
      }
    }

  })(req, res, next);
});

// router.post('/', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) { return next(err); }
//     if (!user) { return res.redirect('/login'); }
//     req.logIn(user, function(err) {
//       if (err) { return next(err); }
//       return res.redirect('/users/' + user.username);
//     });
//   })(req, res, next);
// });


module.exports = router;
