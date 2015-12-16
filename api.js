var bodyparser = require('body-parser');
var express = require('express');
var status = require('http-status');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());
  api.use(bodyparser.urlencoded({
    extended: true
  }));

  api.post('/login', wagner.invoke(function(User) {
    return function(req, res) {
      var user = req.body.user;
      var password = req.body.password;

      User.findOne({ where: { name: user }}).then(
        function(user) {
          if (user && user.verifyPassword(password)) {
            return res.json({ status: 'OK' });
          } else {
            return res.json({ status: 'FAILED' });
          }
        },
        function(err) {
          return res.json({ status: 'FAILED' });
        }
      )
    };
  }));

  return api;
}