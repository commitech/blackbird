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

  var dutySchedule = wagner.invoke(function(DutySchedule) {
    return DutySchedule;
  })

  api.get('/get_duty', function(req, res) {
    if (!req.query.id) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'ID is not spesified' });
    }
    dutySchedule.findOne({where: {id: req.query.id} }).then(
      function(duty) {
        res.json({status: Const.STATUS.OK, 
                  result: duty.dataValues});
      }
    );
  });

  return api;
}