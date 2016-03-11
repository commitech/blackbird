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

      //When a member releases 2 hours of duty, it is a requirement to grab both hours of duty.
	  //If a supervisor releases a 3 (three) hour duty, please grab all 3 (three) hours. => noSingleHourLeft
	  //Cannot have consecutive duties in clb and yih => checked inside DayLimit
	  //One week 14 hours limit => withinWeekLimit
	  //One day 4 hours limit? => within DayLimit
	  canGrabDuty: function(user, specificDuty, callbackOk, callbackError) {
		if (user.position.toLowerCase() != 'subcom') {
			callbackOk();
		}
		
		//Calculting consequtive hours of duty of the supervisor.
		//Checking consecutinve duties in clb and yih along the way.
		this.getConsecHours(specificDuty, user, function(consecHours) {
				if (consecHours > 4) {
					callbackError("Your consecutive duty-hour has exceeded 4");
				} else {
					//Calculting the total hours of duty of the supervisor in one week.
					this.getWeekHours(specificDuty, user, function(weekHours) {
							if (weekHours > 14) {
								callbackError("Your total duty-hour has exceeded 14 for this week");
							} else {
								callbackOk();
							}
						}, function(err) {
							callbackError(err);
					});
				}
			}, function(err) {
				callbackError(err);
		});
	  },

	  canGrabDuties: function(user, duties, callbackOk, callbackError) {
	  	if (duties.length < 1) {
			callbackError();
		}
		this.findAll({ where: {day_name: duties[0].day_name}}).then(function(all) {
			
		});
	  },

	  //This method returns the total hours of duty of the supervisor if he grabs the duty.
	  getWeekHours: function(specificDuty, user, callbackOk, callbackError) {
		var weekHours = 0;
		this.findAll({ where: {supervisor: user.id}).then(function(dutyOfTheWeek) {
			dutyOfTheWeek.forEach(function(duty) {
				weekHours += Math.abs(duty.start_time - duty.end_time) / 3600000;
			});
			weekHours += Math.abs(specificDuty.start_time - specificDuty.end_time) / 3600000;
			callbackOk(weekHours);
		});
	  },

	  //callbackOk with the consecutive hours of duty that a supervisor would have if he grabbed this specific duty.
	  //callbackError if the supervisor needs to rush between clb and yih.
	  getConsecHours: function(specificDuty, user, callbackOk, callbackError) {
		this.findAll({ where: {day_name: specificDuty.day_name}, order: {'start_time', 'ASCE'}}).then(function(duties) {
			var startTime = specificDuty.start_time;
			var endTime = specificDuty.end_time;
			var venue = specificDuty.location.toLowerCase();
			var centralIndex;
			for (var i = 0; i < duties.length; i++) {
				if (duties[i].start_time == startTime) {
					centralIndex = i;
				}
			}
			//Find upper
			for (var i = centralIndex; i > -1; i--) {
				var duty = duties[i];
				if (duty.supervisor == user.id) {
					startTime = duty.start_time;
					if (duty.location.toLowerCase() != venue) {
						callbackError("Rush.");
					}
				} else {
					break;
				}
			}
			
			//Find lower
			for (var i = centralIndex; i < duties.length; i++) {
				if (duties[i].supervisor == user.id) {
					endTime = duties[i].end_time;
					if (duty.location.toLowerCase != venue) {
						callbackError("Rush.");
					}
				} else {
					break;
				}
			}

			var consecHours = (startTime - endTime) / 3600000;
			callbackOk(consecHours);
		});
	  },
/*
	  findDutyByStarttime: function(st, callbackOk, callbackError) {
	  	this.findAll({ where: {start_time: st}}).then(function(duties) {
			if (duties.length > 0) {
				callbackOk(duties[0]);
			} else {
				callbackError("End of upper searching branch.");
			}
		});
	  },
	  
	  findDutyByEndtime: function(et, callbackOk, callbackError) {
	  	this.findAll({ where: {end_time: et}}).then(function(duties) {
			if (duties.length > 0) {
				callbackOk(duties[0]);
			} else {
				callbackError("End of lower searching branch.");
			}
		});
	  },
*/	  
	  grabDuty: function(user, specificDuty, grabRestriction, callbackOk, callbackError) {
        var ReleasedDuty = this.wagner.invoke(function(ReleasedDuty) {
          return ReleasedDuty;
        });

        ReleasedDuty.findAll({ where: _.pick(specificDuty, 'duty_id', 'day', 'month', 'year') }).then(function(released) {
          if (released.length == 0 || released[released.length - 1].grabbed_supervisor_id != null) {
            // duty is not free.
            callbackError('Duty is not available for grab');
          } else {
            // TODO : Check for grabRestriction
            ReleasedDuty.update({grabbed_supervisor_id: user.id}, {where:{id:released[released.length - 1].dataValues.id}}).then(function() {
              callbackOk();
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
