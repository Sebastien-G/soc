var express = require('express');
var router = express.Router();
var Post = require('../models/post');
var utils = require('../lib/utils');


router.get('/', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'not authorized'
    });
  } else {

    var userIds = [req.user._id];

    utils.getFriends(req.user, true).then(function(friendIds) {

      var test = ['yo'];

      if (friendIds.length > 0) {
        userIds = userIds.concat(friendIds);
      }

      Post.find({
        'user_id': {
          $in: userIds
        }
      }).sort('-publicationDate').exec(function(err, posts) {
        if (err) {
          res.error(error);
        } else {
          // console.log(posts);
          res.json({
            status: 'success',
            posts: posts
          });
        }
      });
    }); // utils.getFriends
  } // auth
});

router.post('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    var postObj = {
      uid: req.user.uid,
      user_id: req.user._id,
      content: req.body.message,
      profilePic: req.user.profilePic,
      firstname: req.user.firstname,
      lastname: req.user.lastname
    };

    var post = new Post(postObj);

    post.save(function (err, post, numAffected) {
      if (err) {

      } else {

        var userIds = [req.user._id];

        utils.getFriends(req.user, true).then(function(friendIds) {

          if (friendIds.length > 0) {
            userIds = userIds.concat(friendIds);
          }

          Post.find({
            'user_id': {
              $in: userIds
            }
          }).sort('-publicationDate').exec(function(err, posts) {
            if (err) {
              res.error(error);
            } else {
              // console.log(posts);
              res.json({
                status: 'success',
                posts: posts
              });
            }
          });
        }); // utils.getFriends

/*
        Post.find({}).sort('-publicationDate').exec(function(err, posts) {
          if (err) {
            res.error(error);
          } else {
            res.json({
              status: 'success',
              posts: posts
            });
          }
        });
*/
      }
    });
  } // auth
});

module.exports = router;
