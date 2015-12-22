var Const = require('../const');

exports.loggedInOnly = function(req, res, next) {
  if (!req.user) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: Const.MESSAGE.NOT_LOGGED_IN });
  }
  next();
}

exports.adminOnly = function(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: Const.MESSAGE.UNAUTHORIZED_ACCESS });
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

exports.userRequired = function(req, res, next) {
  if (!req.query.user) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'User is not specified' });
  }
  next();
}

exports.passwordRequired = function(req, res, next) {
  if (!req.query.user) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'Password is not specified' });
  }
  next();
}

