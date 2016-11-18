var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if (req.app.locals.loggedInUsers.hasOwnProperty(req.user.uid)) {
    delete req.app.locals.loggedInUsers[req.user.uid];
  }

  req.logout();
  res.redirect('/');
});

module.exports = router;
