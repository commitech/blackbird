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
        this.findById(dutyId).then( function(duty) {
          callback(duty);
        });
      },

      getSupervisorId: function(specificDuty, wagner, callback) {
        var GrabbedDuty = wagner.invoke(function(GrabbedDuty) {
          return GrabbedDuty;
        });
        var ReleasedDuty = wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        this.findById(specificDuty.duty_id).then( function(duty) {
          GrabbedDuty.findAll({ where: specificDuty.dataValues }).then(function(grabbed) {
            
            ReleasedDuty.findAll({ where: specificDuty.dataValues }).then(function(released) {
              if (released.length == grabbed.length) {
                if (grabbed.length == 0) {
                  // no release/grab yet. go back to original schedule
                  callback(false, duty.dataValues.supervisor);
                } else {
                  // check the latest grabbed entry.
                  callback(false, grabbed[grabbed.length - 1].dataValues.supervisor_id);
                }
              } else {
                // released has more entries than grabbed. 
                // duty has been released and not grabbed yet.
                // return the negative of the last person who released
                callback(true, released[released.length - 1].dataValues.supervisor_id);
              }
            });
          });
        });
      },

      grabDuty: function(user, specificDuty, grabRestriction, wagner, callbackOk, callbackError) {
        var GrabbedDuty = wagner.invoke(function(GrabbedDuty) {
          return GrabbedDuty;
        });

        this.getSupervisorId(specificDuty, wagner, function(freeSlot, supervisorId) {
          if (freeSlot) {
            // duty is free. released and not grabbed yet

            var grabbedDuty = specificDuty;
            specificDuty.supervisor_id = user.id;

            GrabbedDuty.create(grabbedDuty).then(function(){
              callbackOk();
            }, function(err){
              console.log(err);
            });
          } else {
            // duty is not free.
            callbackError('Duty is not available for grab');
          }
        });
      },

      releaseDuty: function(user, specificDuty, wagner, callbackOk, callbackError) {
        var ReleasedDuty = wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        this.getSupervisorId(specificDuty, wagner, function(freeSlot, supervisorId) {
          if (!freeSlot && supervisorId == user.id) {
            // duty is indeed belong to the user
            
            var releasedDuty = specificDuty;
            specificDuty.supervisor_id = user.id;

            ReleasedDuty.create(releasedDuty).then(function(){
              callbackOk();
            }, function(err){
              console.log(err);
            });

          } else {
            callbackError('Duty is not belong to the user');
          }
        });
      },
    }
  });
};
