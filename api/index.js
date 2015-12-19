var express = require('express');

module.exports = function(wagner) {
  var api = express.Router();

  api.use('/user', require('./user')(wagner));
  api.use('/duty', require('./duty')(wagner));

  return api;
}

