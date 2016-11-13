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
      console.log('friends');
      console.log(friends);

      if (friends) {
        friends.forEach (function (user) {
          userFriends.push(user);
        });
      }

      res.render('friends', {
        title: 'Mes amis',
        req: req,
        friends: userFriends
      });

    });


  } // auth
});


module.exports = router;
