var Const = require('./const');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(Const.DB_NAME, Const.DB_USERNAME, Const.DB_PASSWORD, {
  host: Const.DB_LOCATION,
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
  var DutySchedule = sequelize.import("./models/duty_schedule");
  var Duty = sequelize.import("./models/duty");

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