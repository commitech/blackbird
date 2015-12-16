var Sequelize = require('sequelize');
var sequelize = new Sequelize('commitech', 'root', 'root', {
  host: '54.169.17.107',
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

  wagner.factory('User', function() {
    return User;
  });

  wagner.factory('DutySchedule', function() {
    return DutySchedule;
  });
  
}