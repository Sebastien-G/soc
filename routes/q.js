var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  if (req.user) {

    if (req.query.q) {
      var q = req.query.q;
      if (q.length > 0) {

        var User = require('../models/user');

        var re =  new RegExp(q, 'i');

        var query = User.find({
          confirmed: true,
          $or: [
            {
              "firstname": {
                $regex: re
              },
            },
            {
              "lastname": {
                $regex: re
              }
            }
          ]
        }).select({
          "firstname": true,
          "lastname": true,
          "uid": true,
          "_id": false
        });


        query.exec( function(err, users) {
          if (err) {
            return next(err);
          } else {

            res.json({
              status: 'success',
              results: users
            });
          }
        });

      }
    }
  } else {
    res.json({
      status: 'failure',
      results: []
    });
  }
});

module.exports = router;

/*
[
  {
    'name': 'Sébastien Guillon (' + q + ')'
  },
  {
    'name': 'Bill Gates (' + q + ')'
  }
]
*/
