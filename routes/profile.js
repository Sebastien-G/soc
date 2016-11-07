var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');

router.get('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    res.render('profile', {
      title: 'Mon profile',
      req: req
    });
  }
});

router.post('/', function(req, res, next) {
  var username = req.params.username;
  res.render('userEdit', {
    title: 'Modifier mon profile',
    req: req
  });
});

router.post('/picture', function(req, res, next) {

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
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

    res.json({
      error_code: 0,
      err_desc: null
    });
  })

});


module.exports = router;
