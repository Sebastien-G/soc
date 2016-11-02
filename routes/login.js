var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res) {

  if (req.user) {
    res.redirect('/user/' + req.user.username);
  }

  var loginErrorMsg = req.flash('loginError');

  var obj = {
    title: 'Connexion',
    req: req
  }

  if (loginErrorMsg != '') {
    obj.loginErrorMsg = loginErrorMsg
  }
  res.render('login', obj);
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
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect('/user/' + user.username);
    });
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
