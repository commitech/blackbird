var express = require('express');
var Const = require('../const');
var middleware = require('../middleware');

module.exports = function(wagner) {
  var api = express.Router();

  var Duty = wagner.invoke(function(Duty) {
    return Duty;
  });

  api.get('/get_duty', middleware.idRequired, 
    function(req, res) {
    Duty.getDuty(req.query.id, function(duty) {
      return res.json({ status: Const.STATUS.OK,
                        result: duty });
    });
  });

  api.get('/get_supervisor_id', function(req, res) {
    Duty.getSupervisorId(JSON.parse(req.query.specific_duty), function(freeSlot, supervisorId) {
      return res.json({ status: Const.STATUS.OK,
                        result: { is_free: freeSlot, supervisor_id: supervisorId }});
    });
  });

  api.get('/grab_duty', middleware.specificDutyRequired, middleware.userRequired, function(req, res) {
    Duty.grabDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), true, function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  api.get('/release_duty', middleware.specificDutyRequired, middleware.userRequired, function(req, res) {
    Duty.releaseDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err});
    });
  });

  return api;
}

