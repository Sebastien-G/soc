var express = require('express');
var router = express.Router();
var User = require('../models/user');
var utils = require('../lib/utils');


router.get('/', function(req, res, next) {
  res.send('nothing to see here');
});


router.post('/friendships/acceptInvitation', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {


    utils.getUserbyUid(req.body.uid).then(function(user) {
      if (user._id) {

        req.user.acceptRequest(user._id, function (err, result) {
          if (err) {
            console.log(err);
            res.json({
              status: 'failure',
              response: 'Request not registered'
            });
            //throw err;
          } else {

            res.json({
              status: 'success',
              result: result
            });

          }
        });
      } // if (user._id)
    }); // utils.getUserbyUid

  }
}); // removeFriend



router.post('/friendships/removeFriend', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {


    utils.getUserbyUid(req.body.uid).then(function(user) {
      if (user._id) {

        req.user.endFriendship(user._id, function (err, result) {
          if (err) {
            console.log(err);
            res.json({
              status: 'failure',
              response: 'Request not registered'
            });
            //throw err;
          } else {

            res.json({
              status: 'success',
              result: result
            });

          }
        });
      } // if (user._id)
    }); // utils.getUserbyUid

  }
}); // removeFriend


router.post('/friendships/cancelFriendRequest', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    utils.getUserbyUid(req.body.uid).then(function(user) {
      if (user._id) {

        req.user.cancelRequest(user._id, function (err, result) {
          if (err) {
            console.log(err);
            res.json({
              status: 'failure',
              response: 'Request not registered'
            });
            //throw err;
          } else {

            res.json({
              status: 'success',
              result: result
            });
          }
        });
      } // if (user._id)
    }); // utils.getUserbyUid
  }

}); // cancelFriendRequest


router.post('/friendships/sendFriendRequest', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    utils.getUserbyUid(req.body.uid).then(function(user) {
      if (user._id) {
        req.user.friendRequest(user._id, function (err, request) {
          if (err) {
            console.log(err);
            res.json({
              status: 'failure',
              response: 'Request not registered'
            });
            //throw err;
          } else {
            console.log('friendRequest success');
            console.log(request);

            /* Start: e-mail */
            // User registered, send confirmation e-mail
            var nodemailer = require('nodemailer');
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            var transporter = nodemailer.createTransport('smtps://sebastienguillon%40gmail.com:kjxwbbqoadqzotqc@smtp.gmail.com');

            var textBody = 'Bonjour ' + user.firstname + ',\n\n';
            textBody += req.user.firstname + ' ' + req.user.lastname + ' veut devenir votre ami.' + '\n\n';
            textBody += 'Connectez-vous pour accepter son invitation' + '\n';
            textBody += 'http://soc.sebastienguillon.net/invitations' + '\n\n';
            textBody += 'Bonne journée ! 😉' + '\n';

            var htmlBoody = '<a href="http://soc.sebastienguillon.net/""><img src="http://soc.sebastienguillon.net/images/logo_255.png" alt="" border="0"></a>';
            htmlBoody += '<p>Bonjour ' + user.firstname + ',<br><br>';
            htmlBoody += '<strong>' + req.user.firstname + ' ' + req.user.lastname + ' veut devenir votre ami.</strong><br>';
            htmlBoody += '<a href="http://soc.sebastienguillon.net/invitations">Connectez-vous pour accepter son invitation</a>.<br><br>';
            htmlBoody += 'Bonne journée&nbsp;! 😉<br>';

            var emailContent = {
              text: textBody,
              html: htmlBoody
            }
            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: '"SocialBot" <sebastienguillon@gmail.com>', // sender address
              to: user.username, // list of receivers
              subject: '❤️ ' + user.firstname + ' ' + user.lastname + ', vous avez une invitation', // Subject line
              text: emailContent.text, // plaintext body
              html: emailContent.html // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, function(error, info){
              if(error){
                return console.log(error);
              }
              console.log('Message sent: ' + info.response);
            });

            // req.flash('signupConfirmEmail', userInput.username);
            res.json({
              status: 'success',
              friendRequest: request
            });

            /* End: e-mail */
          }
        });
      }
    });
  } // auth
}); // sendFriendRequest

module.exports = router;
