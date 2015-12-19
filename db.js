var Const = require('./const');
var Sequelize = require('sequelize');

var sequelize = new Sequelize(Const.DB.NAME, Const.DB.USERNAME, Const.DB.PASSWORD, {
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
    return sequelize;
  });

  var User = sequelize.import("./models/users");
  var Duty = sequelize.import("./models/duty");
  var DutySchedule = sequelize.import("./models/duty_schedule");

  wagner.factory('User', function() {
    return User;
  });

  wagner.factory('Duty', function() {
    return Duty;
  });

  wagner.factory('DutySchedule', function() {
    return DutySchedule;
  });
  
}