var bodyparser = require('body-parser');
var express = require('express');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Const = require('../const');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());
  api.use(bodyparser.urlencoded({
    extended: true
  }));

  var User = wagner.invoke(function(User) {
    return User;
  })

  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ where: { name: username } }).then(
        function(user) {
          if (user && user.verifyPassword(password)) {
            done(null, user);
          } else {
            done(null, false);
          }
        },
        function(err) {
          return done(err);
        }
      );
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.name);
  });

  passport.deserializeUser(function(username, done) {
    User.findOne({ where: { name: username} }).then(
      function(user) {
        done(null, user);
      },
      function(err) {
        done(err, false);
      }
    )
  });

  api.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.json({ status: Const.FAILED_STATUS_MESSAGE }); }
      if (!user) { return res.json({ status: Const.FAILED_STATUS_MESSAGE }); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json({ status: Const.OK_STATUS_MESSAGE });
      });
    })(req, res, next);
  });

  api.get('/logout', function(req, res) {
    req.logout();
    return res.json({status: Const.OK_STATUS_MESSAGE});
  });

  api.get('/me', function(req, res) {
    return res.json({ status: Const.OK_STATUS_MESSAGE, user: req.user});
  });

  return api;
}