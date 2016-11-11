var express = require('express');
var router = express.Router();

router.get('/:uid', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    // rJBlF87Wx
    var uid = req.params.uid;

    var User = require('../models/user');
    User.findOne({
      uid: uid
    },
    function(err, user) {
      if (err) {
        next();
      } else {
        if (user === null) {
          next();
        } else {
          console.log(user);
          /*
          Jeff.getFriendsOfFriends(function (err, friendsOfJeffsFriends) {
                      if (err) throw (err)

                      console.log('friendsOfJeffsFriends', friendsOfJeffsFriends);
                      // friendsOfJeffsFriends [ { username: 'Sam', _id: 54c6eb7cf2f9fe9672b90ba4, __v: 0 } ]
                  });
          */

          res.render('user', {
            title: 'Profile de ' + user.firstname + ' ' + user.lastname,
            req: req,
            user: user
          });
        }
      }


    });
  }

});

/*
router.get('/edit', function(req, res, next) {
  var username = req.params.username;
  res.render('userEdit', {
    title: 'Modifier mon profile',
    req: req
  });
});
*/

module.exports = router;
