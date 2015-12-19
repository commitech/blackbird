var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Const = require('../const');

module.exports = function(wagner) {
  var api = express.Router();

  var User = wagner.invoke(function(User) {
    return User;
  });

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
      if (err) { return res.json({ status: Const.STATUS.FAILED }); }
      if (!user) { return res.json({ status: Const.STATUS.FAILED }); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.json({ status: Const.STATUS.OK });
      });
    })(req, res, next);
  });

  api.get('/logout', function(req, res) {
    req.logout();
    return res.json({ status: Const.STATUS.OK });
  });

  api.get('/me', function(req, res) {
    return res.json({ status: Const.STATUS.OK, user: req.user});
  });

  return api;
}