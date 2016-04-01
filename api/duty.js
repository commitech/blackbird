var express = require('express');
var Const = require('../const');
var dutyMiddleware = require('../middlewares/duty');
var userMiddleware = require('../middlewares/user');

module.exports = function(wagner) {
  var api = express.Router();

  var Duty = wagner.invoke(function(Duty) {
    return Duty;
  });

  var User = wagner.invoke(function(User) {
    return User;
  })

  api.get('/get_duty', dutyMiddleware.idRequired, function(req, res) {
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

  api.get('/can_grab_duty', dutyMiddleware.specificDutyRequired, dutyMiddleware.userRequired, function(req, res) {
    Duty.canGrabDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), function(can) {
      return res.json({ status: Const.STATUS.OK, result: can });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/grab_duty', dutyMiddleware.specificDutyRequired, dutyMiddleware.userRequired, function(req, res) {
    User.getUser(JSON.parse(req.query.user).id, function(user) {
      Duty.grabDuty(user, JSON.parse(req.query.specific_duty), true, function() {
        return res.json({ status: Const.STATUS.OK});
      }, function(err) {
        return res.json({ status: Const.STATUS.FAILED, comment: err });
      });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/grab_duties', dutyMiddleware.specificDutiesRequired, dutyMiddleware.userRequired, function(req, res) {
    User.getUser(JSON.parse(req.query.user).id, function(user) {
      Duty.grabDuties(user, JSON.parse(req.query.specific_duties), true, function() {
        return res.json({ status: Const.STATUS.OK});
      }, function(err) {
        return res.json({ status: Const.STATUS.FAILED, comment: err });
      });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/release_duty', dutyMiddleware.specificDutyRequired, dutyMiddleware.userRequired, function(req, res) {
    User.getUser(JSON.parse(req.query.user).id, function(user) {
      Duty.releaseDuty(user, JSON.parse(req.query.specific_duty), function() {
        return res.json({ status: Const.STATUS.OK});
      }, function(err) {
        return res.json({ status: Const.STATUS.FAILED, comment: err });
      });
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/release_duties', dutyMiddleware.specificDutiesRequired, dutyMiddleware.userRequired, function(req, res) {
    User.getUser(JSON.parse(req.query.user).id, function(user) {
      Duty.releaseDuties(user, JSON.parse(req.query.specific_duties), function() {
        return res.json({ status: Const.STATUS.OK});
      }, function(err) {
        return res.json({ status: Const.STATUS.FAILED, comment: err });
      });
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

  api.get('/assign_temporary_duty', userMiddleware.adminOnly, dutyMiddleware.userRequired, dutyMiddleware.specificDutyRequired, function(req, res) {
    Duty.assignSpecificDuty(JSON.parse(req.query.user), JSON.parse(req.query.specific_duty), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/assign_temporary_duties', userMiddleware.adminOnly, dutyMiddleware.userRequired, dutyMiddleware.specificDutiesRequired, function(req, res) {
    Duty.assignSpecificDuties(JSON.parse(req.query.user), JSON.parse(req.query.specific_duties), function() {
      return res.json({ status: Const.STATUS.OK});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/get_duty_schedule', dutyMiddleware.dayRequired, dutyMiddleware.monthRequired, dutyMiddleware.yearRequired, function(req, res) {
    Duty.getDutySchedule(req.query.day, req.query.month, req.query.year, function(schedules) {
      return res.json({ status: Const.STATUS.OK,
                        result: schedules});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/get_original_duty_schedule', dutyMiddleware.dayNameRequired, function(req, res) {
    Duty.getOriginalDutySchedule(req.query.day_name, function(schedules) {
      return res.json({ status: Const.STATUS.OK,
                        result: schedules});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/get_free_duties', dutyMiddleware.dayRequired, dutyMiddleware.monthRequired, dutyMiddleware.yearRequired, function(req, res) {
    Duty.getFreeDuties(req.query.day, req.query.month, req.query.year, function(specificDuties) {
      return res.json({ status: Const.STATUS.OK,
                        result: specificDuties});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/get_all_free_duties', function(req, res) {
    Duty.getAllFreeDuties(function(specificDuties) {
      return res.json({ status: Const.STATUS.OK,
                        result: specificDuties});
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  api.get('/can_grab_duty', dutyMiddleware.specificDutyRequired, dutyMiddleware.userRequired, function(req, res) {
    User.getUser(JSON.parse(req.query.user).id, function(user) {
      Duty.canGrabDuty(user, JSON.parse(req.query.specific_duty), function() {
        return res.json({ status: Const.STATUS.OK,}); // can grab
      }, function(err) {
        return res.json({ status: Const.STATUS.FAILED, comment: err }); // can't grab for reason err
      });  
    }, function(err) {
      return res.json({ status: Const.STATUS.FAILED, comment: err });
    });
  });

  return api;
}
