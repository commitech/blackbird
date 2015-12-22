var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Const = require('../const');
var userMiddleware = require('../middlewares/user');

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
    req.session.destroy();
    return res.json({ status: Const.STATUS.OK });
  });

  api.get('/me', function(req, res) {
    return res.json({ status: Const.STATUS.OK, result: req.user});
  });

  api.get('/get_user', userMiddleware.idRequired, function(req, res) {
    User.getUser(req.query.id, function(user) {
      return res.json({ status: Const.STATUS.OK, result: user});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/add_user', userMiddleware.adminOnly, userMiddleware.userRequired, userMiddleware.passwordRequired, function(req, res) {
    User.addUser(JSON.parse(req.query.user), req.query.password, function(id) {
      return res.json({ status: Const.STATUS.OK, result: id});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/remove_user', userMiddleware.adminOnly, userMiddleware.userRequired, function(req, res) {
    User.removeUser(JSON.parse(req.query.user), function() {
      return res.json({ status: Const.STATUS.OK });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/edit_user', userMiddleware.userRequired, function(req, res) {
    User.editUser(JSON.parse(req.query.user), function() {
      return res.json({ status: Const.STATUS.OK });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/edit_password', userMiddleware.userRequired, userMiddleware.passwordRequired, function(req, res) {
    User.editPassword(JSON.parse(req.query.user), req.query.password, function() {
      return res.json({ status: Const.STATUS.OK });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/get_all_users', function(req, res) {
    User.getAllUsers(function(users) {
      return res.json({ status: Const.STATUS.OK, result: users});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/get_notify_users', function(req, res) {
    User.getNotifyUsers(function(users) {
      return res.json({ status: Const.STATUS.OK, result: users});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  return api;
}