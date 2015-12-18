var Const = require('./const');

exports.loggedInOnly = function(req, res, next) {
  if (!req.user) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: Const.MESSAGE.NOT_LOGGED_IN });
  }
  next();
}
