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

      getSupervisorId: function(specificDuty, callback) {
        var GrabbedDuty = this.wagner.invoke(function(GrabbedDuty) {
          return GrabbedDuty;
        });
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        this.findById(specificDuty.duty_id).then( function(duty) {
          GrabbedDuty.findAll({ where: {duty_id: specificDuty.duty_id,
                                        day: specificDuty.day,
                                        month: specificDuty.month,
                                        year: specificDuty.year }}).then(function(grabbed) {
            
            ReleasedDuty.findAll({ where: {duty_id: specificDuty.duty_id,
                                          day: specificDuty.day,
                                          month: specificDuty.month,
                                          year: specificDuty.year }}).then(function(released) {
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
                callback(true, released[released.length - 1].dataValues.supervisor_id);
              }
            });
          });
        });
      },

      grabDuty: function(user, specificDuty, grabRestriction, callbackOk, callbackError) {
        var GrabbedDuty = this.wagner.invoke(function(GrabbedDuty) {
          return GrabbedDuty;
        });

        this.getSupervisorId(specificDuty, function(freeSlot, supervisorId) {
          if (freeSlot) {
            // duty is free. released and not grabbed yet

            var grabbedDuty = specificDuty;
            specificDuty.supervisor_id = user.id;

            // TODO : Check for grabRestriction.

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

      grabDuties: function(user, specificDuties, grabRestriction, callbackOk, callbackError) {
        var totalGrabbedDuties = 0;
        specificDuties.forEach(function(specificDuty) {
          this.grabDuty(user, specificDuty, grabRestriction, function(){
            ++totalGrabbedDuties;
            if (totalGrabbedDuties == specificDuties.length) {
              callbackOk();
            }
          }, function(err) {
            callbackError(err);
          });
        });
      },

      releaseDuty: function(user, specificDuty, callbackOk, callbackError) {
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        this.getSupervisorId(specificDuty, function(freeSlot, supervisorId) {
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

      releaseDuties: function(user, specificDuties, callbackOk, callbackError) {
        var totalReleaseDuties = 0;
        specificDuties.forEach(function(specificDuty) {
          this.releaseDuty(user, specificDuty, function() {
            ++totalReleaseDuties;
            if (totalReleaseDuties == specificDuties.length) {
              callbackOk();
            }
          }, function(err) {
            callbackError(err);
          });
        });
      },

      assignPermanentDuty: function(user, duty, callbackOk, callbackError) {
        // TODO : Remove all grab / release activity that involves this duty ID.
        this.update({supervisor:user.id},{where:{id:duty.id}}).then(function(){
          callbackOk();
        },function(err){
          callbackError(err);
        })
      },

      assignPermanentDuties: function(user, duties, callbackOk, callbackError) {
        var totalAssignedDuties = 0;
        duties.forEach(function(duty) {
          this.assignPermanentDuty(user, duty, function() {
            ++totalAssignedDuties;
            if (totalAssignedDuties == duties.length) {
              callbackOk();
            }
          }, function(err) {
            callbackError(err);
          })
        });
      },

      assignTemporaryDuty: function(user, specificDuty, callbackOk, callbackError) {
        this.getSupervisorId(specificDuty, function(isFree, supervisorId) {
          if (!isFree) {
            releaseDuty({id: supervisorId}, specificDuty, function() {
              grabDuty(user, specificDuty, function() {
                callbackOk();
              }, function(err) {
                callbackError(err);
              })
            }, function(err) {
              callbackError(err);
            });
          } else {
            grabDuty(user, specificDuty, function() {
              callbackOk();
            }, function(err) {
              callbackError(err);
            })
          }
        });
      },

      assignTemporaryDuties: function(user, specificDuties, callbackOk, callbackError) {
        var totalAssignedDuties = 0;
        specificDuties.forEach(function(specificDuty) {
          this.assignTemporaryDuty(user, specificDuty, function() {
            ++totalAssignedDuties;
            if (totalAssignedDuties == specificDuties.length) {
              callbackOk();
            }
          }, function(err) {
            callbackError(err);
          })
        });
      },

      getDutySchedule: function(day, month, year, callbackOk, callbackError) {
        var date = new Date(year, month - 1, day);
        var Const = require('../const.js');
        var day_name = Const.DAY_NAME[date.getDay()];
        var that = this;
        this.getOriginalDutySchedule(day_name, function(schedules) {
          var changedSchedule = 0;
          schedules.forEach(function(schedule) {
            var specificDuty = {duty_id: schedule.duty_id,
                              day: day,
                              month: month,
                              year: year};
            that.getSupervisorId(specificDuty, function(isFree, supervisorId) {
              schedule.is_free = isFree;
              schedule.supervisor_id = supervisorId;
              ++changedSchedule;
              if (changedSchedule == schedules.length) {
                callbackOk(schedules);
              }
            });
          });
        }, function(err) {
          callbackError(err);
        });
      },

      getOriginalDutySchedule: function(day_name, callbackOk, callbackError) {
        this.findAll({where: {day_name: day_name}}).then(function(schedules) {
          var scheduleArray = new Array();
          schedules.forEach(function(schedule) {
            scheduleArray.push({duty_id: schedule.dataValues.id,
                                supervisor_id: schedule.dataValues.supervisor});
          })
          callbackOk(scheduleArray);
        }, function(err) {
          callbackError(err);
        });
      },

      getFreeDuties: function(day, month, year, location) {
        // TODO
      }
    }
  });
};
