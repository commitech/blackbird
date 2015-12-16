var Const = require('./const.js');

exports.loggedInOnly = function(req, res, next) {
  if (!req.user) {
    return res.json({ status: Const.FAILED_STATUS_MESSAGE, 
                      comment: Const.NOT_LOGGED_IN_ERROR_MESSAGE });
  }
  next();
}