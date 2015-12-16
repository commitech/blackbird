var bodyparser = require('body-parser');
var express = require('express');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Const = require('../const.js');

module.exports = function(wagner) {
  var api = express.Router();

  api.use(bodyparser.json());
  api.use(bodyparser.urlencoded({
    extended: true
  }));

  var dutySchedule = wagner.invoke(function(DutySchedule) {
    return DutySchedule;
  })

  api.get('/get_duty', function(req, res) {
    if (!req.user) {
      return res.json({ status: Const.FAILED_STATUS_MESSAGE, 
                        comment: Const.NOT_LOGGED_IN });
    }
    if (!req.query.id) {
      return res.json({ status: Const.FAILED_STATUS_MESSAGE, 
                        comment: 'ID is not spesified' });
    }
    dutySchedule.findOne({where: {id: req.query.id} }).then(
      function(duty) {
        res.json({status: Const.OK_STATUS_MESSAGE, 
                  result: duty.dataValues});
      }
    );
  });

  return api;
}