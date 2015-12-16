var express = require('express');
var wagner = require('wagner-core');
var passport = require('passport');
var middleware = require('./middleware');

require('./db')(wagner);

var app = express();

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get(middleware.loggedInOnly);

app.use('/api/v1/user', require('./api/user')(wagner));
app.use('/api/v1/duty', require('./api/duty')(wagner));

app.listen(3000);
console.log('Listening on port 3000!');
