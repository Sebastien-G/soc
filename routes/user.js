var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');

router.get('/:uid', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    // rJBlF87Wx
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
          /*
          Jeff.getFriendsOfFriends(function (err, friendsOfJeffsFriends) {
            if (err) throw (err)

            console.log('friendsOfJeffsFriends', friendsOfJeffsFriends);
            // friendsOfJeffsFriends [ { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 } ]
          });
          */
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
            res.render('user', {
              title: 'Profile de ' + user.firstname + ' ' + user.lastname,
              req: req,
              user: user,
              activeTab: 'friends'
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
          /*
          Jeff.getFriendsOfFriends(function (err, friendsOfJeffsFriends) {
            if (err) throw (err)

            console.log('friendsOfJeffsFriends', friendsOfJeffsFriends);
            // friendsOfJeffsFriends [ { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 } ]
          });
          */
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
            res.render('userAbout', {
              title: 'Profile de ' + user.firstname + ' ' + user.lastname,
              req: req,
              user: user,
              activeTab: 'friends'
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
          /*
          Jeff.getFriendsOfFriends(function (err, friendsOfJeffsFriends) {
            if (err) throw (err)

            console.log('friendsOfJeffsFriends', friendsOfJeffsFriends);
            // friendsOfJeffsFriends [ { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 } ]
          });
          */
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
            res.render('userFriends', {
              title: 'Profile de ' + user.firstname + ' ' + user.lastname,
              req: req,
              user: user,
              activeTab: 'friends'
            });
          }); // getFriendshipStatus

        }
      }
    }); // User.findOne
  }
});


/*
router.get('/edit', function(req, res, next) {
  var username = req.params.username;
  res.render('userEdit', {
    title: 'Modifier mon profile',
    req: req
  });
});
*/

module.exports = router;
