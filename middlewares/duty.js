var Const = require('../const');

exports.dutyRequired = function(req, res, next) {
  if (!req.query.duty) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Duty is not specified' });
  }
  next();
}

exports.dutiesRequired = function(req, res, next) { 
  if (!req.query.duties) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Duties is not specified' });
  }
  next();
}


exports.specificDutyRequired = function(req, res, next) {
  if (!req.query.specific_duty) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Specific duty is not specified' });
  }
  next();
}

exports.specificDutiesRequired = function(req, res, next) {
  if (!req.query.specific_duties) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Specific duties is not specified' });
  }
  next();
}

exports.dayRequired = function(req, res, next) {
  if (!req.query.day) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Day is not specified' });
  }
  next();
}

exports.monthRequired = function(req, res, next) {
  if (!req.query.month) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Month is not specified' });
  }
  next();
}

exports.yearRequired = function(req, res, next) {
  if (!req.query.year) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Year is not specified' });
  }
  next();
}

exports.dayNameRequired = function(req, res, next) {
  if (!req.query.day_name) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Day name is not specified' });
  }
  next();
}

exports.userRequired = function(req, res, next) {
  if (!req.query.user) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'User is not specified' });
  }
  next();
}

exports.idRequired = function(req, res, next) {
  if (!req.query.id) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'ID is not specified' });
  }
  next();
}
