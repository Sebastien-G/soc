var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Message = require('../models/message');
var utils = require('../lib/utils');

router.get('/', function(req, res, next) {

  if (!req.user || req.user.role !== 'admin') {
    res.redirect('/login');
  } else {

    var users;
    var userStats = {
      total: 0,
      confirmed: 0,
      awaitingConfirmation: 0
    };
    var posts = {};
    User.count({}, function(err, count) {
      console.log(count);
      userStats.total = count;

      User.count({
        'confirmed': true
      }, function(err, count) {
        console.log(count);
        userStats.confirmed = count;

        User.count({
          'confirmed': false
        }, function(err, count) {
          console.log(count);
          userStats.awaitingConfirmation = count;

          var query = User.find({}).select({
            "firstname": true,
            "lastname": true,
            "confirmed": true,
            "username": true,
            "created": true,
            "role": true,
            "dateOfBirth": true,
            "gender": true,
            "confirmationDate": true,
            "profilePic": true,
            "uid": true
          });
          query.exec( function(err, users) {
            if (err) {
              return next(err);
            } else {
              res.render('pages/admin/index', {
                title: 'Administration du site',
                req: req,
                userStats: userStats,
                users: users
              });
            }
          });
        });
      });
    });
  }
}); // GET /


router.get('/user/edit/:_id', function(req, res, next) {

  if (!req.user || req.user.role !== 'admin') {
    res.redirect('/login');
  } else {

    var user_id = req.params._id;

    var obj = {
      title: 'Modifier un compte utilisateur',
      req: req
    };

    var deleteUserConfirm = req.flash('deleteUserConfirm');
    if (deleteUserConfirm != '') {
      console.log('deleteUserConfirm: ' + deleteUserConfirm);
      obj.deleteUserConfirm = deleteUserConfirm
    } else {
      console.log('NO FLASH MESSAGE');
    }

    res.render('pages/admin/userEdit', obj);

  } // auth
}); // GET /user/edit/:_id


router.get('/users', function(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    res.redirect('/login');
  } else {

    var users;

    var query = User.find({}).select({
      "firstname": true,
      "lastname": true,
      "confirmed": true,
      "username": true,
      "created": true,
      "role": true,
      "dateOfBirth": true,
      "gender": true,
      "confirmationDate": true,
      "profilePic": true,
      "uid": true
    });
    query.exec( function(err, users) {
      if (err) {
        return next(err);
      } else {
        res.render('pages/admin/users', {
          title: 'Membres',
          req: req,
          users: users
        });
      }
    });
  }
}); // GET / users


router.get('/api/user/get/:_id', function(req, res, next) {

  if (!req.user || req.user.role !== 'admin') {
    res.redirect('/login');
  } else {

    var user_id = req.params._id;

    var query = User.find({
      '_id': {
        $eq: user_id
      }
    });
    query.exec( function(err, user) {
      if (err) {
        return next(err);
      } else {

        res.json({
          status: 'success',
          results: user
        });

      }
    });
  } // auth
}); // GET /user/edit/:_id


router.post('/api/user/save', function(req, res, next) {

  if (!req.user || req.user.role !== 'admin') {
    res.redirect('/login');
  } else {

    if (req.body && req.body._id && req.body._id == '') {

      queryObj = {
        '_id': req.body._id
      }
      setObject = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        role: req.body.role,
        gender: req.body.gender
      }

      User.findOneAndUpdate(queryObj, {
        $set: setObject
      }, {
        new: true
      }, function(err, user) {
        if (err) {
          console.log('Error updating data!');
        } else {
          if (user) {
            console.log('user');
            console.log(user);
            res.json({
              status: 'success',
              results: user
            });
          } else {
          }
        }
      });

    } else {

      res.json({
        status: 'failure'
      });

    }

  } // auth
}); // POST /api/user/save


router.post('/api/user/delete', function(req, res, next) {

  if (!req.user || req.user.role !== 'admin') {
    res.redirect('/login');
  } else {

    if (req.body && req.body._id && req.body._id != '') {

      var removeUserFromRelatedTables = function() {

        Post.find({
          'user_id': req.body._id
        }).remove().exec(function (err, posts) {
          if (err) {
            return next(err);
          } else {

            console.log('Posts by user "' + req.body._id + '" removed from collection "posts"');

            Message.find({
              'from.user_id': req.body._id
            }).remove().exec(function (err, messages) {
              if (err) {
                return next(err);
              } else {

                console.log('Posts by user "' + req.body._id + '" removed from collection "messages"');
              }
            });
          }
        });
      }

      User.findByIdAndRemove(req.body._id, function(err, obj) {
        if (err) {
          console.log('User.findByIdAndRemove ERROR:');
          console.log(err);
        }

        req.flash('deleteUserConfirm', 'L’utilisateur a été supprimé.');
        console.log('User "' + req.body._id + '" removed from collection "users"');
        removeUserFromRelatedTables();

        res.json({
          status: 'success',
        });

      });


    } else {

      res.json({
        status: 'failure'
      });

    } // body content check

  } // auth
}); // POST /api/user/delete


module.exports = router;
