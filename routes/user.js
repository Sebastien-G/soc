var express = require('express');
var router = express.Router();

router.get('/:username', function(req, res, next) {
  var username = req.params.username;
  res.render('user', {
    title: 'Mon compte',
    req: req
  });
});

router.get('/edit', function(req, res, next) {
  var username = req.params.username;
  res.render('userEdit', {
    title: 'Modifier mon profile',
    req: req
  });
});

module.exports = router;
