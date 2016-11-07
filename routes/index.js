var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var obj = {
    title: 'Social Network about nothing',
    req: req
  };

  if (req.query.confirm) {
    var confirm = req.query.confirm;

    if (confirm == 'signup') {
      var signupConfirmEmail = req.flash('signupConfirmEmail');
      if (signupConfirmEmail != '') {
        obj.signupConfirmEmail = signupConfirmEmail
      }
    }

    if (confirm == 'account') {
      var userId = req.flash('accountConfirmed');
      if (userId != '') {
        obj.accountConfirmed = userId
      }
    }

  }

  res.render('index', obj);
});

module.exports = router;
