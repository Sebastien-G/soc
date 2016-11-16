var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var obj = {
    title: 'Chat',
    req: req
  };

  res.render('chat', obj);
});

module.exports = router;
