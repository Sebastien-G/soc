var express = require('express');
var router = express.Router();
var Post = require('../models/post');


router.get('/', function(req, res, next) {

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

});

router.post('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    var postObj = {
      uid: req.user.uid,
      user_id: req.user._id,
      content: req.body.message,
      firstname: req.user.firstname,
      lastname: req.user.lastname
    };

    var post = new Post(postObj);

    post.save(function (err, post, numAffected) {
      if (err) {

      } else {

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

      }
    });
  } // auth
});

module.exports = router;
