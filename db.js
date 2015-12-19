var config = require('./config');
var Sequelize = require('sequelize');
var _ = require('underscore');

var db = new Sequelize(config.DB.NAME, config.DB.USERNAME, config.DB.PASSWORD, {
  host: config.DB.HOST,
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
    GrabbedDuty: db.import('./models/grabbed_duty'),
    ReleasedDuty: db.import('./models/released_duty')
  }

  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      value.wagner = wagner;
      return value;
    });
  });
  
  return models;
}