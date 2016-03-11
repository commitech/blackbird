var express = require('express');
var wagner = require('wagner-core');
var passport = require('passport');
var bodyparser = require('body-parser');
var Const = require('./const');

var morgan = require('morgan');

exports.models = require('./db')(wagner);
exports.wagner = wagner;

var app = exports.app = express();

// Session middleware
app.use(require('express-session')({ secret: require('./config').APP.SECRET_KEY, resave: true, saveUninitialized: true }));

// Auth middleware
app.use(passport.initialize());
app.use(passport.session());

// Body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var logDirectory = __dirname + '/log';
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

morgan.token('username', function(req, res) {
  return JSON.stringify(req.user);
});
app.use(morgan(':username', {stream: accessLogStream}));
app.use(morgan('combined', {stream: accessLogStream}));

app.use('/api/v1', require('./api')(wagner));

exports.server = app.listen(3000);
console.log('Listening on port 3000!');
