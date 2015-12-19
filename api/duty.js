var express = require('express');
var Const = require('../const');

module.exports = function(wagner) {
  var api = express.Router();

  var Duty = wagner.invoke(function(Duty) {
    return Duty;
  });

  api.get('/get_duty', function(req, res) {
    if (!req.query.id) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'ID is not specified' });
    }
    Duty.getDuty(req.query.id, function(duty) {
      return res.json({ status: Const.STATUS.OK,
                        result: duty });
    });
  });

  api.get('/get_supervisor_id', function(req, res) {
    if (!req.query.specific_duty) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'Specific duty is not specified' });
    }
    Duty.getSupervisorId(JSON.parse(req.query.specific_duty), wagner, function(duty) {
      return res.json({ status: Const.STATUS.OK,
                        result: duty });
    });
  });

  api.get('/grab_duty', function(req, res) {
    if (!req.query.specific_duty) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'Specific duty is not specified' });
    }
    if (!req.query.user) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'User is not specified' });
    }
    Duty.grabDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), true, wagner, function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/release_duty', function(req, res) {
    if (!req.query.specific_duty) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'Specific duty is not specified' });
    }
    if (!req.query.user) {
      return res.json({ status: Const.STATUS.FAILED, 
                        comment: 'User is not specified' });
    }
    Duty.releaseDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), wagner, function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  return api;
}

