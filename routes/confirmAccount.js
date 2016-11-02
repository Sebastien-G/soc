var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  var confirmId = req.params.id;

  res.redirect('/?id=' + confirmId);
  //res.redirect('/');
});

module.exports = router;
