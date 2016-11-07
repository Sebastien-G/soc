var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', function(req, res, next) {

  if (req.query.id) {
    var confirmId = req.query.id;

    User.findOne({
      confirmationString: confirmId
    }, function(err, results) {
      if (err) {
        return handleError(err);
      }

      console.log(results);
    });

  }

  User.findOneAndUpdate({
    confirmationString: confirmId,
    confirmed: false,
  }, {
    $set: {
      confirmed: true,
      confirmationDate: Date.now()
    }
  }, {
    new: true
  }, function(err, user) {
    if (err) {
      console.log('Error updating data!');
    } else {
      if (user) {
        console.log('user');
        console.log(user);

        req.logIn(user, function(err) {
          if (err) {
            return next(err);
          }

          req.flash('accountConfirmed', user.uid);
          res.redirect('/?confirm=account');
        });
      } else {
        res.redirect('/');
      }
    }
  });
  //res.redirect('/?id=' + confirmId);

});

module.exports = router;
