/* jshint indent: 2 */

var _ = require('underscore');

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
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        this.findById(specificDuty.duty_id).then( function(duty) {
          ReleasedDuty.findAll({ where: _.pick(specificDuty, 'duty_id', 'day', 'month', 'year') }).then(function(released) {
            if (released.length == 0) {
              // no release/grab yet. go back to original schedule
              callback(false, duty.dataValues.supervisor);
            } else {
              // check the latest grabbed entry.
              if (released[released.length - 1].grabbed_supervisor_id != null) {
                callback(false, released[released.length - 1].dataValues.grabbed_supervisor_id);  
              } else {
                callback(true, released[released.length - 1].dataValues.released_supervisor_id);  
              }
            }
          });
        });
      },

      canGrabDuty: function(user, specificDuty, callbackOk, callbackError) {
        callbackOk(true);/*
        User.getUser(user.id, function(userObject) {
          if (userObject.position != "Subcom") {
            callbackOk(true);
          }
          // TODO : Check whether the subcom can grab this duty
        }, function(err) {
          callbackError(err);
        });*/
      },

      grabDuty: function(user, specificDuty, grabRestriction, callbackOk, callbackError) {
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        ReleasedDuty.findAll({ where: _.pick(specificDuty, 'duty_id', 'day', 'month', 'year') }).then(function(released) {
          if (released.length == 0 || released[released.length - 1].grabbed_supervisor_id != null) {
            // duty is not free.
            callbackError('Duty is not available for grab');
          } else {
            canGrabDuty(user, specificDuty, function(canGrab) {
              if (canGrab) {
                ReleasedDuty.update({grabbed_supervisor_id: user.id}, {where:{id:released[released.length - 1].dataValues.id}}).then(function() {
                  callbackOk();
                }, function(err) {
                  callbackError(err);  
                });
              } else {
                callbackError(canGrab);
              }
            }, function(err) {
              callbackError(err);
            });
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
            specificDuty.released_supervisor_id = user.id;

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
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });
        var that = this;
        
        // Remove all grab / release activity that involves this duty ID.
        ReleasedDuty.destroy({where: {duty_id: duty.id}}).then( function() {
          that.update({ supervisor: user.id }, { where: { id: duty.id } }).then(function() {
            callbackOk();
          }, function(err){
            callbackError(err);
          });
        }, function(err) {
          callbackError(err);
        });
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
            releaseDuty({ id: supervisorId }, specificDuty, function() {
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
        this.findAll({ where: { day_name: day_name } }).then(function(schedules) {
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

      getFreeDuties: function(day, month, year, callbackOk, callbackError) {
        this.getAllFreeDuties(function(freeDuties) {
          var countedDuties = 0;
          var filteredDuties = new Array();
          freeDuties.forEach(function(freeDuty) {
            if (freeDuty.day == day && freeDuty.month == month && freeDuty.year == year) {
              filteredDuties.push(freeDuty);
            }
            ++countedDuties;
            if (countedDuties == freeDuties.length) {
              callbackOk(filteredDuties);
            }
          });
        }, function(err) {
          callbackError(err);
        })
      },

      getAllFreeDuties: function(callbackOk, callbackError) {
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        var freeDuties = new Array();

        ReleasedDuty.findAll().then(function(schedules) {
          var countedSchedules = 0;
          schedules.forEach(function(schedule) {
            if (schedule.dataValues.grabbed_supervisor_id == null) {
              freeDuties.push(schedule.dataValues);
            }
            ++countedSchedules;
            if (countedSchedules == schedules.length) {
              callbackOk(freeDuties);
            }
          });
        }, function(err) {
          callbackError(err);
        });
      }
    }
  });
};
