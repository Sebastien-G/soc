var express = require('express');
var router = express.Router();
var utils = require('../lib/utils');

router.get('/', function(req, res, next) {

  if (req.user) {

    if (req.query.q) {
      var q = req.query.q;
      if (q.length > 0) {

        var User = require('../models/user');

        var re =  new RegExp(q, 'i');

        var query = User.find({
          confirmed: true,
          $or: [
            {
              "firstname": {
                $regex: re
              },
            },
            {
              "lastname": {
                $regex: re
              }
            }
          ]
        }).select({
          "profilePic": true,
          "firstname": true,
          "lastname": true,
          "uid": true,
          "_id": false
        });


        query.exec( function(err, users) {
          if (err) {
            return next(err);
          } else {

            res.json({
              status: 'success',
              results: users
            });
          }
        });

      }
    }
  } else {
    res.json({
      status: 'failure',
      results: []
    });
  }
});


router.get('/friends', function(req, res, next) {

  if (req.user) {

    if (req.query.q) {

      var q = req.query.q;

      if (q.length > 0) {

        var User = require('../models/user');

        var friendIds = [];
        utils.getFriends(req.user).then(function(friends) {
          if (friends) {
            friends.forEach (function (user) {
              friendIds.push(user._id);
            });
          }
          var re =  new RegExp(q, 'i');

          var query = User.find({
            '_id': {
              $in: friendIds
            },
            confirmed: true,
            $or: [
              {
                "firstname": {
                  $regex: re
                },
              },
              {
                "lastname": {
                  $regex: re
                }
              }
            ]
          }).select({
            "profilePic": true,
            "firstname": true,
            "lastname": true,
            "uid": true,
            "_id": false
          });
          query.exec( function(err, users) {
            if (err) {
              return next(err);
            } else {

              res.json({
                status: 'success',
                results: users
              });
            }
          });
        }); // utils.getFriends
      }
    }
  } else {
    res.json({
      status: 'failure',
      results: []
    });
  }
});


module.exports = router;

/*
[
  {
    'name': 'Sébastien Guillon (' + q + ')'
  },
  {
    'name': 'Bill Gates (' + q + ')'
  }
]
*/
