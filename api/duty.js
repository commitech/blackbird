var bodyparser = require('body-parser');
var express = require('express');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Const = require('../const.js');

module.exports = function(wagner) {
  var Duty = require('../objects/duty')(wagner);
  var api = express.Router();

  api.use(bodyparser.json());
  api.use(bodyparser.urlencoded({
    extended: true
  }));

  api.get('/get_duty', function(req, res) {
    if (!req.query.id) {
      return res.json({ status: Const.FAILED_STATUS_MESSAGE, 
                        comment: 'ID is not specified' });
    }
    Duty.getDuty(req.query.id, function(duty) {
      res.json({status: Const.OK_STATUS_MESSAGE, 
                  result: duty});
    });
  });

  return api;
}

