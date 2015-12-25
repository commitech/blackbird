var express = require('express');
var Const = require('../const');
var announcementMiddleware = require('../middlewares/announcement');
var userMiddleware = require('../middlewares/user');

module.exports = function(wagner) {
  var api = express.Router();

  var Announcement = wagner.invoke(function(Announcement) {
    return Announcement;
  });

  api.get('/get_announcement', announcementMiddleware.idRequired, function(req, res) {
    Announcement.getAnnouncement(req.query.id, function(announcement) {
      return res.json({ status: Const.STATUS.OK,
                        result: announcement });
    });
  });

  return api;
}
