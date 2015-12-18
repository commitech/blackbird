module.exports = function(wagner) {

  var duty = wagner.invoke(function(Duty) {
    return Duty;
  })

  var Duty = function(_id, _day_name, _start_time, _end_time, _location) {
    this.id = _id;
    this.day_name = _day_name;
    this.start_time = _start_time;
    this.end_time = _end_time;
    this.location = _location;
  };

  Duty.cloneDuty = function(duty) {
    var newDuty = new Duty(duty.id, duty.day_name, duty.start_time, duty.end_time, duty.location);
    return newDuty;
  }

  Duty.getDuty = function(dutyId, callback) {
    duty.findOne({where: {id: dutyId} }).then(
      function(duty) {
        callback(Duty.cloneDuty(duty.dataValues));
      }
    );
  }

  return Duty;

}
