var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var PasswordReset = require('../models/passwordReset');
// var nodemailer = require('nodemailer'); // loaded only later

router.get('/', function(req, res, next) {

  if (req.user) {
    res.redirect('/user/' + req.user.username);
  }

  res.render('pages/public/recover', {
    title: 'Informations de compte oubliées',
    req: req
  });
}); // GET /


router.post('/', function(req, res) {
  var requiredInputs = [
    'username'
  ];
  var i;
  var userInput = {};
  var invalidFields = [];
  var formErrors = false;
  var missingInput = false;

  for (i = 0; i < requiredInputs.length; i++) {
    if (req.body[requiredInputs[i]]) {
      userInput[requiredInputs[i]] = req.body[requiredInputs[i]];
    }
    else {
      missingInput = true;
    }
  }

  var formMessages = {};
  var field;


  field = 'username';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre adresse e-mail';
    invalidFields.push([field]);
  }


  if (invalidFields.length > 0) {
    formErrors = true;
    console.log('invalidFields.length > 0');
    console.log(invalidFields);
  }


  if (formErrors) {
    res.json({
      status: 'error',
      formData: userInput,
      formMessages: formMessages
    });
    return false;

  } else {


    User.findOne({
      'username': userInput.username,
    }, 'username firstname lastname', function (err, user) {
      if (err) {
        return handleError(err);
      }
      if (user === null) {

        res.json({
          status: 'failure',
          message: 'noMatch'
        });

      } else {

        console.log(user);
        // Process user registration
        var randomstring = require('randomstring');
        var confirmationString = randomstring.generate(32);

        var recoverObj = {
          email: user.username,
          confirmationString: confirmationString
        };

        var passwordReset = new PasswordReset(recoverObj);

        passwordReset.save(function (err, doc, numAffected) {
          if (err) {

          } else {

            // User registered, send confirmation e-mail
            var nodemailer = require('nodemailer');
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            var transporter = nodemailer.createTransport('smtps://sebastienguillon%40gmail.com:kjxwbbqoadqzotqc@smtp.gmail.com');

            var textBody = 'Bonjour' + user.firstname + ' ' + user.lastname + ',' + '\n\n';
            textBody += 'Nous avons reçu une demande de ré-initialisation de mot de passe.' + '\n';
            textBody += 'Pour changer votre mot de passe, suivez ce lien. ' + '\n';
            textBody += 'http://soc.sebastienguillon.net/recover/confirm?id=' + confirmationString + '\n\n';
            textBody += 'Si vous n’êtes pas à l’origine de cette demande, ne faites rien, aucun changement ne sera effectué sur votre compte.' + '\n';
            textBody += 'Bonne journée ! 😉' + '\n';

            var htmlBoody = '<a href="http://soc.sebastienguillon.net/""><img src="http://soc.sebastienguillon.net/images/logo_255.png" alt="" border="0"></a>';
            htmlBoody += '<p>Bonjour ' + user.firstname + ' ' + user.lastname + ',<br><br>';
            htmlBoody += 'Nous avons reçu une demande de ré-initialisation de mot de passe.<br>';
            htmlBoody += 'Pour changer votre mot de passe, <a href="http://soc.sebastienguillon.net/recover/confirm?id=' + confirmationString + '">suivez ce lien</a>.<br>';
            htmlBoody += '<b>Si vous n’êtes pas à l’origine de cette demande, ne faites rien, aucun changement ne sera effectué sur votre compte.</b>' + '<br><br>';
            htmlBoody += 'Bonne journée&nbsp;! 😉<br>';

            var emailContent = {
              text: textBody,
              html: htmlBoody
            }
            // setup e-mail data with unicode symbols
            var mailOptions = {
              from: '"SocialBot" <sebastienguillon@gmail.com>', // sender address
              to: user.username, // list of receivers
              subject: 'Mot de passe oublié', // Subject line
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

            req.flash('recoverConfirmEmail', userInput.username);
            res.json({
              status: 'success'
            });
          }
        }); // passwordReset.save
      } // no match
    })
  }
}); // POST /


router.get('/confirm', function(req, res, next) {

  if (req.user) {
    res.redirect('/user/' + req.user.username);
  } else {

    if (req.query.id) {
      var confirmId = req.query.id;

      PasswordReset.findOne({
        confirmationString: confirmId
      }, 'confirmationString email', function(err, results) {
        if (err) {
          return handleError(err);
        }

        if (results === null) {
          res.json({
            status: 'failure',
            message: 'noMatch'
          });
        } else {
          res.render('pages/public/recoverConfirm', {
            title: 'Créer un nouveau mot de passe',
            req: req,
            id: results.confirmationString
          });
        }
      });
    }
  } // user authenticated - redirect
}); // GET /confirm


router.post('/confirm', function(req, res, next) {
  var requiredInputs = [
    'id',
    'password',
    'password-repeat'
  ];
  var i;
  var userInput = {};
  var invalidFields = [];
  var formErrors = false;
  var missingInput = false;

  for (i = 0; i < requiredInputs.length; i++) {
    if (req.body[requiredInputs[i]]) {
      userInput[requiredInputs[i]] = req.body[requiredInputs[i]];
    }
    else {
      missingInput = true;
    }
  }

  var formMessages = {};
  var field;

  field = 'password';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre mot de passe';
    invalidFields.push([field]);
  }

  field = 'password';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre mot de passe';
    invalidFields.push([field]);
  }

  field = 'password-repeat';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez confirmer votre mot de passe';
    invalidFields.push([field]);
  } else {
    if (userInput[field] !== userInput['password']) {
      formMessages[field] = 'Les mots de passe ne correspondent pas';
      invalidFields.push([field]);
    }
  }

  if (invalidFields.length > 0) {
    formErrors = true;
    console.log('invalidFields.length > 0');
    console.log(invalidFields);
  }

  if (formErrors) {
    res.json({
      status: 'failure',
      formData: userInput,
      formMessages: formMessages
    });
    return false;

  } else {

    PasswordReset.findOne({
      'confirmationString': userInput.id,
    }, 'email', function (err, results) {
      if (err) {
        return handleError(err);
      }
      if (results === null) {
        console.log();
      } else {
        console.log('found: ' + results.email);

        User.findOne({
          username: results.email
        }, function(err, user) {
          if (err) {
            console.log('Error updating data!');
          } else {
            if (user === null) {

              res.json({
                status: 'failure'
              });

            } else {

              console.log('user');
              console.log(user);

              user.setPassword(userInput.password, function(err) {
                if (err) {
                  console.log('Unable to set password');
                } else {

                  user.save(function(err) {
                    if (err) {
                      console.log('Unable to save user document after setPassword');
                    } else {

                      res.json({
                        status: 'success'
                      });

                    }
                  }); // user.save
                }
              }); // user.setPassword
            }
          }
        }); // User.findOneAndUpdate
      } // results.email found
    }); // PasswordReset.findOne
  } // formErrors

}); // POST /confirm


module.exports = router;
