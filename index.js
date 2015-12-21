var express = require('express');
var wagner = require('wagner-core');
var passport = require('passport');
var bodyparser = require('body-parser');
var Const = require('./const');

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

app.use('/api/v1', require('./api')(wagner));

exports.server = app.listen(3000);
console.log('Listening on port 3000!');