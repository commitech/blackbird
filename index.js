var express = require('express');
var wagner = require('wagner-core');
var passport = require('passport');
var bodyparser = require('body-parser');
var middleware = require('./middleware');

require('./db')(wagner);

var app = express();

// Middleware
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.get('*', middleware.loggedInOnly);

app.use('/api/v1', require('./api')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
