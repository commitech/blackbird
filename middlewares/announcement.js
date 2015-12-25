var Const = require('../const');

exports.idRequired = function(req, res, next) {
  if (!req.query.id) {
    return res.json({ status: Const.STATUS.FAILED, 
                      comment: 'ID is not specified' });
  }
  next();
}
