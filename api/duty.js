var express = require('express');
var Const = require('../const');
var dutyMiddleware = require('../middlewares/duty');
var userMiddleware = require('../middlewares/user');

module.exports = function(wagner) {
  var api = express.Router();

  var Duty = wagner.invoke(function(Duty) {
    return Duty;
  });

  api.get('/get_duty', dutyMiddleware.idRequired, 
    function(req, res) {
    Duty.getDuty(req.query.id, function(duty) {
      return res.json({ status: Const.STATUS.OK,
                        result: duty });
    });
  });

  api.get('/get_supervisor_id', function(req, res) {
    Duty.getSupervisorId(JSON.parse(req.query.specific_duty), function(freeSlot, supervisorId) {
      return res.json({ status: Const.STATUS.OK,
                        result: { is_free: freeSlot, supervisor_id: supervisorId } });
    });
  });

  api.get('/grab_duty', dutyMiddleware.specificDutyRequired, dutyMiddleware.userRequired, function(req, res) {
    Duty.grabDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), true, function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/grab_duties', dutyMiddleware.specificDutiesRequired, dutyMiddleware.userRequired, function(req, res) {
    Duty.grabDuties(JSON.parse(req.query.user), JSON.parse(req.query.specific_duties), true, function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/release_duty', dutyMiddleware.specificDutyRequired, dutyMiddleware.userRequired, function(req, res) {
    Duty.releaseDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/release_duties', dutyMiddleware.specificDutiesRequired, dutyMiddleware.userRequired, function(req, res) {
    Duty.releaseDuties(JSON.parse(req.query.user), JSON.parse(req.query.specific_duties), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/assign_permanent_duty', userMiddleware.adminOnly, dutyMiddleware.userRequired, dutyMiddleware.dutyRequired, function(req, res) {
    Duty.assignPermanentDuty(JSON.parse(req.query.user), JSON.parse(req.query.duty), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/assign_permanent_duties', userMiddleware.adminOnly, dutyMiddleware.userRequired, dutyMiddleware.dutiesRequired, function(req, res) {
    Duty.assignPermanentDuties(JSON.parse(req.query.user), JSON.parse(req.query.duties), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  return api;
}
