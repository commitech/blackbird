var Const = require('../const');

exports.specificDutyRequired = function(req, res, next) {
  if (!req.query.specific_duty) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Specific duty is not specified' });
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