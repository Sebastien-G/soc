var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {

  if (req.user) {

    if (req.query.q) {
      var q = req.query.q;
      if (q.length > 0) {

        res.json({
          status: 'success',
          results: [
            {
              'name': 'Sébastien Guillon (' + q + ')'
            },
            {
              'name': 'Bill Gates (' + q + ')'
            }
          ]
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
