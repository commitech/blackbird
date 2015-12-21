var config = require('./config');
var Sequelize = require('sequelize');
var _ = require('underscore');

module.exports = function(wagner) {
  var dbConfig = config.DB[config.APP.STAGE];

  var db = new Sequelize(dbConfig.NAME, dbConfig.USERNAME, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
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

  wagner.factory('db', function() {
    return db;
  });

  var models = {
    User: db.import('./models/users'),
    Duty: db.import('./models/duty'),
    GrabbedDuty: db.import('./models/grabbed_duty'),
    ReleasedDuty: db.import('./models/released_duty'),
    TrackingDefault: db.import('./models/trackingdefault')
  }

  _.each(models, function(value, key) {
    wagner.factory(key, function() {
      value.wagner = wagner;
      return value;
    });
  });
  
  return models;
}