/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('duty', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    day_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    end_time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    supervisor: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    classMethods: {
      getDuty: function(dutyId, callback) {
        this.findOne({ where: { id: dutyId } }).then( function(duty) {
          callback(duty);
        });
      },

      getSupervisorId: function(specificDuty, wagner, callback) {
        console.log(specificDuty);
        this.findOne({ where: {id: specificDuty.duty_id}}).then( function(duty) {
          var GrabbedDuty = wagner.invoke(function(GrabbedDuty) {
            return GrabbedDuty;
          });
          GrabbedDuty.findAll({where: {duty_id: specificDuty.duty_id,
                                       day: specificDuty.day,
                                       month: specificDuty.month,
                                       year: specificDuty.year}}).then(function(grabbed) {
            var ReleasedDuty = wagner.invoke(function(ReleasedDuty) {
              return ReleasedDuty;
            });
            ReleasedDuty.findAll({where: {duty_id: specificDuty.duty_id,
                                       day: specificDuty.day,
                                       month: specificDuty.month,
                                       year: specificDuty.year}}).then(function(released) {
              if (released.length == grabbed.length) {
                if (grabbed.length == 0) {
                  // no release/grab yet. go back to original schedule
                  callback(duty.dataValues.supervisor);
                } else {
                  // check the latest grabbed entry.
                  callback(grabbed[grabbed.length - 1].dataValues.supervisor_id);
                }
              } else {
                // released has more entries than grabbed. 
                // duty has been released and not grabbed yet.
                // return the negative of the last person who released
                callback(-1 * released[released.length - 1].dataValues.supervisor_id);
              }
            });
          });
        });
      }
    }
  });
};
