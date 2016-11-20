var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');

router.get('/:uid', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {

    var uid = req.params.uid;

    var User = require('../models/user');
    User.findOne({
      uid: uid
    },
    function(err, user) {
      if (err) {
        return next(err);
      } else {
        if (user === null) {
          return next(err);
        } else {
          user.userUrl = '/user/' + user.uid;
          utils.getFriendshipStatus(req.user, user.uid).then(function(friendshipStatus) {
            switch (friendshipStatus) {
              case 0:
              case 1:
                user.friendshipStatus = 'none';
                user.addButtonAction = 'add';
                break;
              case 2:
                user.friendshipStatus = 'pending';
                user.addButtonAction = 'cancel';
                break;
              case 3:
                user.friendshipStatus = 'friends';
                user.addButtonAction = 'remove';
                break;
            }
            res.render('pages/public/user', {
              title: 'Profile de ' + user.firstname + ' ' + user.lastname,
              req: req,
              user: user,
              activeTab: 'journal'
            });
          }); // getFriendshipStatus
        }
      }
    }); // User.findOne
  }
});


router.get('/:uid/about', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    var uid = req.params.uid;

    var User = require('../models/user');
    User.findOne({
      uid: uid
    },
    function(err, user) {
      if (err) {
        return next(err);
      } else {
        if (user === null) {
          return next(err);
        } else {
          user.userUrl = '/user/' + user.uid;
          utils.getFriendshipStatus(req.user, user.uid).then(function(friendshipStatus) {
            switch (friendshipStatus) {
              case 0:
              case 1:
                user.friendshipStatus = 'none';
                user.addButtonAction = 'add';
                break;
              case 2:
                user.friendshipStatus = 'pending';
                user.addButtonAction = 'cancel';
                break;
              case 3:
                user.friendshipStatus = 'friends';
                user.addButtonAction = 'remove';
                break;
            }
            res.render('pages/public/userAbout', {
              title: 'Profile de ' + user.firstname + ' ' + user.lastname,
              req: req,
              user: user,
              activeTab: 'about'
            });
          }); // getFriendshipStatus
        }
      }
    }); // User.findOne
  }
});


router.get('/:uid/friends', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    var uid = req.params.uid;

    var User = require('../models/user');
    User.findOne({
      uid: uid
    },
    function(err, user) {
      if (err) {
        return next(err);
      } else {
        if (user === null) {
          return next(err);
        } else {

          user.userUrl = '/user/' + user.uid;

          utils.getFriendshipStatus(req.user, user.uid).then(function(friendshipStatus) {
            switch (friendshipStatus) {
              case 0:
              case 1:
                user.friendshipStatus = 'none';
                user.addButtonAction = 'add';
                break;
              case 2:
                user.friendshipStatus = 'pending';
                user.addButtonAction = 'cancel';
                break;
              case 3:
                user.friendshipStatus = 'friends';
                user.addButtonAction = 'remove';
                break;
            }

            var userFriends = [];

            utils.getFriends(user).then(function(friends) {
              if (friends) {
                friends.forEach (function (user) {
                  utils.getProfilePic(user);
                  userFriends.push(user);
                });
              }

              res.render('pages/public/userFriends', {
                title: 'Profile de ' + user.firstname + ' ' + user.lastname,
                req: req,
                user: user,
                activeTab: 'friends',
                friends: userFriends
              });
            }); // utils.getFriends
          }); // getFriendshipStatus
        }
      }
    }); // User.findOne
  }
});

module.exports = router;
