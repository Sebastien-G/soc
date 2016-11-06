var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var username = req.params.username;
  res.render('user', {
    title: 'Mon compte',
    req: req
  });
});

module.exports = router;
