var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
// var nodemailer = require('nodemailer'); // loaded only later

/*
var days = {
  '0': 'Jour',
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  '10': 10,
  '11': 11,
  '12': 12,
  '13': 13,
  '14': 14,
  '15': 15,
  '16': 16,
  '17': 17,
  '18': 18,
  '19': 19,
  '20': 20,
  '21': 21,
  '22': 22,
  '23': 23,
  '24': 24,
  '25': 25,
  '26': 26,
  '27': 27,
  '28': 28,
  '29': 29,
  '30': 30,
  '31': 31
};

var months = {
  0: 'Mois',
  1: 'Janvier',
  2: 'Février',
  3: 'Mars',
  4: 'Avril',
  5: 'Mai',
  6: 'Juin',
  7: 'Juillet',
  8: 'Août',
  9: 'Septembre',
  10: 'Octobre',
  11: 'Novembre',
  12: 'Décembre'
};
var years = {
  '0': 'Année'
};
var year = parseInt(new Date().getFullYear());
for (year; year >= 1900; year--) {
  years[year] = year;
}
*/
var formData = {
  'firstname': '',
  'lastname': '',
  'username': '',
  'username-repeat': '',
  'password': ''/*,
  'birthday': '',
  'birthmonth': '',
  'birthyear': ''*/
}


router.get('/', function(req, res, next) {

  if (req.user) {
    res.redirect('/user/' + req.user.username);
  }


  res.render('signup', {
    title: 'Inscription',
    req: req,
    /*days: days,
    months: months,
    years: years,*/
    formData: formData
  });
});

router.post('/', function(req, res) {
  var requiredInputs = [
    'firstname',
    'lastname',
    'username',
    'username-repeat',
    'password'
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

  field = 'firstname';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre prénom';
    invalidFields.push([field]);
  }

  field = 'lastname';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre nom de famille';
    invalidFields.push([field]);
  }

  field = 'username';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre adresse e-mail';
    invalidFields.push([field]);
  }

  field = 'username-repeat';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez confirmer votre adresse e-mail';
    invalidFields.push([field]);
  }

  field = 'password';
  if (userInput[field] === undefined || userInput[field] === '') {
    userInput[field] = '';
    formMessages[field] = 'Veuillez saisir votre mot de passe';
    invalidFields.push([field]);
  }


  if (invalidFields.length > 0) {
    formErrors = true;
  }


  if (formErrors) {
    // res.render('signup', {
    //   title: 'Inscription',
    //   req: req,
    //   formData: userInput,
    //   formMessages: formMessages
    // });

    res.json({
      status: 'error',
      formData: userInput
    });
    return false;

  } else {

    // Process user registration
    var randomstring = require('randomstring');
    var confirmationString = randomstring.generate(32);

    formMessages.username = 'Cette adresse e-mail est déjà utilisée';

    User.register(new User({
      confirmationString: confirmationString,
      firstname: userInput.firstname,
      lastname: userInput.lastname,
      username: userInput.username
    }),
    userInput.password,
    function(err, user) {
      if (err) {
        /*return res.render('signup', {
          title: 'Inscription',
          formData: userInput,
          xformData: userInput,
          formMessages: formMessages
        });*/

        return res.json({
          status: 'error',
          formData: userInput,
          formMessages: formMessages,
          error: 'UserExists'
        });
      } else {

        // User registered, send confirmation e-mail
        var nodemailer = require('nodemailer');
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

        var transporter = nodemailer.createTransport('smtps://sebastienguillon%40gmail.com:kjxwbbqoadqzotqc@smtp.gmail.com');

        var textBody = 'Bonjour ' + userInput.firstname + '\n\n';
        textBody += 'http://localhost/confirm-account?id=' + confirmationString + '\n';

        var htmlBoody = '<p>Bonjour ' + userInput.firstname + '<br><br>';
        htmlBoody += 'Veuillez <a href="http://localhost/confirm-account?id=' + confirmationString + '">confirmer votre inscription</a><br>';

        var emailContent = {
          text: textBody,
          html: htmlBoody
        }
        // setup e-mail data with unicode symbols
        var mailOptions = {
          from: '"SocialBot" <sebastienguillon@gmail.com>', // sender address
          to: userInput.username, // list of receivers
          subject: userInput.firstname + ' ' + userInput.lastname + ', finalisez votre inscription ❤', // Subject line
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

        req.flash('signupConfirmEmail', userInput.username);
        res.json({
          status: 'success'
        });
      }
/*
      passport.authenticate('local')(req, res, function () {
        //res.redirect('/');
        res.json({
          status: 'success'
        });
      });
*/
    });

  }
});

module.exports = router;
