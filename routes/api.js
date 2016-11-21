var express = require('express');
var router = express.Router();
var User = require('../models/user');
var User = require('../models/user');
var Message = require('../models/message');
var Notification = require('../models/notification');
var utils = require('../lib/utils');


router.get('/', function(req, res, next) {
  res.send('nothing to see here');
});


router.get('/profile/get', function(req, res, next) {
  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    User.find({
      '_id': {
        $eq: req.user._id
      }
    }).select({
      'about': true,
      'gender': true,
      'firstname': true,
      'lastname': true
    }).exec(function (err, user) {
      res.json({
        status: 'success',
        results: user
      });

    });
  } // auth

});



router.post('/profile/save', function(req, res, next) {
  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    queryObj = {
      '_id': req.user._id
    }

    setObject = {
      about: req.body.about,
      gender: req.body.gender
    }

    User.findOneAndUpdate(queryObj, {
      $set: setObject
    }, {
      new: true
    }, function(err, user) {
      if (err) {
        console.log('Error updating data!');
      } else {
        if (user) {
          console.log('user');
          console.log(user);
          res.json({
            status: 'success',
            results: user
          });
        } else {
        }
      }
    });


  } // auth

});


router.post('/messages/send', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    var content = req.body.content;
    var toUids = req.body.toUids;
    console.log(content);
    console.log(toUids);
    User.find({
      'uid': {
        $in: toUids
      }
    }).select({
      "_id": true
    }).exec(function (err, users) {
      if (err) {
        console.log(err);
      } else {

        if (users.length) {
          console.log(users);

          var message = new Message({
            direction: 'sender',
            content: content,
            owner_id: req.user._id,
            fromUser: req.user._id,
            toUsers: users
          });
          message.save(function (err, newMessage) {
            if (err) {
              console.log(err);
            } else {
              console.log('Message saved for sender (' + req.user.firstname + ')');

              res.json({
                status: 'success',
              });

              users.forEach(function (user) {

                var message = new Message({
                  direction: 'receiver',
                  content: content,
                  owner_id: user._id,
                  fromUser: req.user._id,
                  toUsers: users
                });
                message.save(function (err, newMessage) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Message saved for recepient ' + user.firstname);
                  }
                });
              });

            }
          });
        }
      }
    });
  } // auth


  /*
  http://mongoosejs.com/docs/populate.html
  http://stackoverflow.com/questions/21069813/mongoose-multiple-query-populate-in-a-single-call
  */
  /*
      var fromId = "581fc388c0d82830a0ee0993";
      var toId =   "58262749997f282ad0bb1dea";

      var message = new Message({
        content: "Doubting",
        fromUser: fromId,
        toUser: toId
      });
  console.log(message);
      message.save(function (err, newMessage) {
        if (err) {
          console.log(err);
        } else {

          Message.findOne({
            '_id': newMessage._id
          })
          .populate([
            {
              path:'fromUser',
              select:'firstname lastname uid profilePic'
            },
            {
              path:'toUser',
              select:'firstname lastname uid profilePic'
            }
          ])
          .exec(function (err, foundMessage) {
            if (err) {
              console.log(err);
            } else {
              console.log(foundMessage);
              console.log('The from.user.firstname is %s', foundMessage.fromUser.firstname);
            }

          });


        }

      });
  */



}); // POST /messages/send


router.get('/messages/get/sent', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    Message.find({
      'owner_id': req.user._id,
      'direction': 'sender'
    })
    .populate([
      {
        path:'toUsers',
        select:'firstname lastname uid profilePic'
      }
    ])
    .exec(function (err, foundMessages) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: 'failure',
          results: foundMessages
        });
      }
    });
  } // auth
}); // GET /messages/sent



router.get('/messages/get/received', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    Message.find({
      'owner_id': req.user._id,
      'direction': 'receiver'
    })
    .populate([
      {
        path:'fromUser',
        select:'firstname lastname uid profilePic'
      },
      {
        path:'toUsers',
        select:'firstname lastname uid profilePic'
      }
    ])
    .exec(function (err, foundMessages) {
      if (err) {
        console.log(err);
      } else {
        res.json({
          status: 'failure',
          results: foundMessages
        });
      }
    });
  } // auth
}); // GET /messages/sent



router.post('/friendships/acceptInvitation', function(req, res, next) {

  if (!req.user) {
    res.json({
      status: 'failure',
      response: 'Not authorized'
    });
  } else {

    if(req.body && req.body.uid) {

      var requesterUid = req.body.uid;
      utils.getUserbyUid(requesterUid).then(function(user) {
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

  /* Start: notify */
              // Notify the user whose friend request was accepted
              var notificationObj = {
                user_id: user._id,
                uid: requesterUid,
                type: 'acceptedFriendRequest'
              };
              var notification = new Notification(notificationObj);
              notification.save(function (err, doc, numAffected) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('Notification saved');
                }
              });
  /* End: notify */

              res.json({
                status: 'success',
                result: result
              });

            }
          });
        } // if (user._id)
      }); // utils.getUserbyUid
    } // req.body check
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
