var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Message = require('../models/message');
var utils = require('../lib/utils');


router.get('/', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {
    var obj = {
      title: 'Messagerie privée',
      req: req
    };

    res.render('pages/public/messages', obj);

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
        return handleError(err);
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
            return handleError(err);
          } else {
            console.log(foundMessage);
            console.log('The from.user.firstname is %s', foundMessage.fromUser.firstname);
          }

        });


      }

    });
*/

});

/*
router.get('/sent', function(req, res, next) {

  if (!req.user) {
    res.redirect('/login');
  } else {

    var renderObj = {
      title: 'Messagerie privée',
      req: req
    };
    res.render('pages/public/messagesSent', renderObj);
  } // auth
});
*/

module.exports = router;
