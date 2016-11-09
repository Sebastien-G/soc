var compression = require('compression');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan'); // use it or lose it
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

// Passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' });
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' });
//       }
//       return done(null, user);
//     });
//   }
// ));

// Mongoose
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/socTest');

var app = express();
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

/*
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'scss'),
  dest: path.join(__dirname, 'public'),
  includePaths:[path.join(__dirname, 'node_modules/foundation-sites/assets/')],
  indentedSyntax: true,
  sourceMap: true
}));
*/
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
app.use('/', require('./routes/index'));

app.use('/about', require('./routes/about'));

app.use('/signup', require('./routes/signup'));
app.use('/user', require('./routes/user'));
app.use('/profile', require('./routes/profile'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/confirm-account', require('./routes/confirmAccount'));

app.use('/post', require('./routes/post'));

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
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
