var express = require('express');
var router = express.Router();
var User = require('../models/user');
var utils = require('../lib/utils');


router.get('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {

    var userInvitations = [];
    var userSentRequests = [];


    utils.getReceivedRequests(req.user).then(function(receivedRequests) {
      if (receivedRequests) {
        receivedRequests.forEach (function (user) {
          utils.getProfilePic(user.requester);
          userInvitations.push({
            profilePic: user.requester.profilePic,
            firstname: user.requester.firstname,
            lastname: user.requester.lastname,
            uid: user.requester.uid,
            friendshipStatus: "accept",
            action: "accept"
          });
        });
      }

      utils.getSentRequests(req.user).then(function(sentRequests) {
        console.log('sentRequests');
        console.log(sentRequests);

        if (sentRequests) {
          sentRequests.forEach (function (user) {
            utils.getProfilePic(user.requested);
            userSentRequests.push({
              profilePic: user.requested.profilePic,
              firstname: user.requested.firstname,
              lastname: user.requested.lastname,
              uid: user.requested.uid,
              friendshipStatus: "pending",
              action: "cancel"
            });
          });
        }

        res.render('invitations', {
          title: 'Invitations',
          req: req,
          invitations: userInvitations,
          sentRequests: userSentRequests
        });

      });

    });

/*
.catch(function (err) {
  res.render('invitations', {
    title: 'Invitations',
    req: req,
    invitations: invitations,
    sentRequests: sentRequests
  });

} )
*/

  }
});


module.exports = router;
