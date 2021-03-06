var compression = require('compression');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var expressValidator = require('express-validator');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // use it or lose it
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var flash = require('connect-flash');
var chalk = require('chalk');

// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/socTest');

var app = express();
app.use(expressValidator());

// https://expressjs.com/en/advanced/best-practice-performance.html
app.use(compression()); // will gzip output
app.use(flash());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// Start: added per:
// http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/#.WBV-Y-2KRi9
app.use(session({
//  store: new MongoStore({db: db}),
  secret: 'e!b(£6^§§914C9£5*01A$_b^284a*096(!6f0*1f!&849*3).',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  })
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
var User = require('./models/user');
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// End: added per:
// http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/#.WBV-Y-2KRi9

// Routes
app.use(function (req, res, next) {
  app.locals.moment = require('moment');
  // console.log(chalk.blue('app.locals.loggedInUsers'));
  // console.log(app.locals.loggedInUsers);

  if (req.user) {
    if (req.user.profilePicId) {
      var filenameParts = req.user.profilePicId.split('.');
      var fileName = filenameParts[0];
      var fileExt = filenameParts[1];
      req.user.profilePicUid = fileName;
      req.user.profilePic = fileName + '_50.' + fileExt;
    }

  }
  next();
})
app.use('/', require('./routes/index'));

app.use('/api', require('./routes/api'));

app.use('/about', require('./routes/about'));

app.use('/messages', require('./routes/messages'));

app.use('/signup', require('./routes/signup'));
app.use('/user', require('./routes/user'));
app.use('/profile', require('./routes/profile'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/confirm-account', require('./routes/confirmAccount'));

app.use('/friends', require('./routes/friends'));
app.use('/invitations', require('./routes/invitations'));

app.use('/post', require('./routes/post'));

app.use('/recover', require('./routes/recover'));

app.use('/q', require('./routes/q'));

app.use('/admin', require('./routes/admin'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true; // output indented HTML
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/public/error', {
      message: err.message,
      error: err,
      req: req
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('pages/public/error', {
    message: err.message,
    error: {},
    req: req
  });
});


module.exports = app;
