var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('req.user : ' + req.user);
  res.render('index', {
    title: 'Social Network about nothing',
    req: req
  });
});

module.exports = router;
