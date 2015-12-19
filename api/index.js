var express = require('express');
var userMiddleware = require('../middlewares/user');

module.exports = function(wagner) {
  var api = express.Router();

  api.get('*', userMiddleware.loggedInOnly);
  api.use('/user', require('./user')(wagner));
  api.use('/duty', require('./duty')(wagner));

  return api;
}

