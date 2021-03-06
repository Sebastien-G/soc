var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var obj = {
    title: 'SG Net',
    req: req,
    homepage: true
  };

  if (req.query.confirm) {
    var confirm = req.query.confirm;

    if (confirm == 'recover') {
      var recoverConfirmEmail = req.flash('recoverConfirmEmail');
      if (recoverConfirmEmail != '') {
        obj.recoverConfirmEmail = recoverConfirmEmail
      }
    }

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

  res.render('pages/public/index', obj);
});

module.exports = router;
