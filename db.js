var Const = require('./const');
var Sequelize = require('sequelize');
var _ = require('underscore');

var db = new Sequelize(Const.DB.NAME, Const.DB.USERNAME, Const.DB.PASSWORD, {
  host: Const.DB.HOST,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  define: {
    timestamps: false,
    freezeTableName: true
  }
});

module.exports = function(wagner) {
  
  wagner.factory('db', function() {
    return db;
  });

  var models = {
    User: db.import('./models/users'),
    Duty: db.import('./models/duty'),
    DutySchedule: db.import('./models/duty_schedule')
  }

  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      return value;
    });
  });
  
}