var express = require('express');
var router = express.Router();
var User = require('../models/user');
var utils = require('../lib/utils');

// API
// - randomUuid([options]);


router.get('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {

    var userFriends = [];

    utils.getFriends(req.user).then(function(friends) {
      if (friends) {
        friends.forEach (function (user) {
          utils.getProfilePic(user);
          userFriends.push(user);
        });
      }

      res.render('pages/public/friends', {
        title: 'Mes amis',
        req: req,
        friends: userFriends
      });
    }); // utils.getFriends


  } // auth
});


module.exports = router;
