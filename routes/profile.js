var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');
var randomUuid = require('random-uuid');
var User = require('../models/user');

// API
// - randomUuid([options]);




router.get('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {


    // var srcImage = path.join(__dirname, '../public/images/profile/' + req.user.profilePicId);
    var srcImage = req.user.profilePicId;
    var filenameParts = req.user.profilePicId.split('.');
    var fileName = filenameParts[0];
    var fileExt = filenameParts[1];

    //req.user.profilePic = '/images/profile/' + fileName + '_300.' + fileExt;

/*
    User.findOne({
      username: 'sebastienguillon+bill.gates@gmail.com'
    }, function(err, user) {
      if (err) {
        return handleError(err);
      }

      console.log(user);

      //console.log('BillGates: ' + BillGates);
      //console.log('typeof req.user._id: ' + typeof req.user._id);

      req.user.friendRequest(user._id, function (err, request) {
        if (err) {
          console.log(err);
          //throw err;
        } else {
          console.log(request);
        }
      });


      //req.user.getSentRequests(req.user._id);

      user.acceptRequest(req.user._id, function (err, friendship) {
        if (err) {
          console.log(err);
          //throw err;
        } else {
          console.log('friendship', friendship);
        }
      });
    });
*/



    res.render('pages/public/profile', {
      title: 'Mon profile',
      req: req
    });
  }
});


router.post('/', function(req, res, next) {
  var username = req.params.username;
  res.render('pages/public/userEdit', {
    title: 'Modifier mon profile',
    req: req
  });
});


router.post('/picture', function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {

    var sharp = require('sharp');
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/profile'));
      },
      filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        var ext = file.originalname.split('.')[file.originalname.split('.').length -1];
        //  file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
        cb(null, randomUuid() + '.' + ext);
      }
    });

    var upload = multer({
      storage: storage
    }).single('file');

    upload(req, res, function(err) {
      if (err) {
        console.log(err);
        res.json({
          error_code: 1,
          err_desc: err
        });
        return;
      }

      var srcImage = path.join(__dirname, '../public/images/profile/' + req.file.filename);
      var filenameParts = req.file.filename.split('.');
      var fileName = filenameParts[0];
      var fileExt = filenameParts[1];
      var profilePic = fileName + '_50.' + fileExt;

      var formats = [50, 100, 200, 300, 500, 1000];
      formats.forEach(function(size) {
        var destImg = path.join(__dirname, '../public/images/profile/' + fileName + '_' + size + '.' + fileExt);
        sharp(srcImage).resize(size).toFile(destImg, function(err) {
          console.log('resize done: ' + destImg);
        });
      });



      User.update({_id: req.user._id}, {
        profilePic: profilePic,
        profilePicId: req.file.filename
      }, function(err, numberAffected, rawResponse) {
        res.json({
          error_code: 0,
          err_desc: null
        });
      })
    })
  }
});


module.exports = router;
