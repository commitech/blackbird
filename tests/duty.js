var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var passportStub = require('passport-stub');
var Const = require('../const');

var URL_ROOT = 'http://localhost:3000/api/v1';

describe("Duty API test", function(){
  var Duty;
  var server;
  var agent;

  before(function() {

    app = require('../').app;
    models = require('../').models;
    server = require('../').server;

    Duty = models.Duty;

    passportStub.install(app);
    agent = superagent.agent();
  });

  afterEach(function() {
    passportStub.logout();
  });

  it('cannot fetch data without logging in', function(done) {
    agent.get(URL_ROOT + '/duty/get_duty').end(function(err, res) {
      assert.equal(res.status, 200);
      var json;
      assert.doesNotThrow(function() {
        json = JSON.parse(res.text);
      });
      assert.equal(json.status, 'FAILED');
      assert.equal(json.comment, Const.MESSAGE.NOT_LOGGED_IN);
      done();
    });
  });

  it('can fetch data', function(done) {
    passportStub.login({ name: 'admin' });
    agent.get(URL_ROOT + '/duty/get_duty?id=1').end(function(err, res) {
      assert.equal(res.status, 200);
      var json;
      assert.doesNotThrow(function() {
        json = JSON.parse(res.text);
      });
      assert.equal(json.status, 'OK');
      assert.equal(json.result.id, 1);
      assert.equal(json.result.day_name, 'Monday');
      assert.equal(json.result.start_time, '08:00:00');
      assert.equal(json.result.end_time, '08:30:00');
      assert.equal(json.result.location, 'yih');
      done();
    });
  });

  it('can get supervisor ID', function(done) {
    passportStub.login({ name: 'admin' });

    specificDuty = {duty_id: 1,day: 1, month: 1, year: 1};

    agent.get(URL_ROOT + '/duty/get_supervisor_id?specific_duty=' + JSON.stringify(specificDuty)).end(function(err, res) {
      assert.equal(res.status, 200);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.equal(result.status, 'OK');
      assert.equal(result.result.is_free, false);
      assert.equal(result.result.supervisor_id, 1);
      done();
    });
  })

  it('cannot grab duty that is not free', function(done) {
    passportStub.login({ name: 'admin' });
    
    user = {id: 1};
    specificDuty = {duty_id: 1,day: 1, month: 1, year: 1};

    agent.get(URL_ROOT + '/duty/grab_duty?user=' + JSON.stringify(user) + '&specific_duty=' + JSON.stringify(specificDuty)).end(function(err, res) {
      assert.equal(res.status, 200);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.equal(result.status, 'FAILED');
      done();
    });
  });

  it('cannot release duty that does not belong to the user', function(done) {
    passportStub.login({ name: 'admin' });

    user = {id: 2};
    specificDuty = {duty_id: 1,day: 1, month: 1, year: 1};

    agent.get(URL_ROOT + '/duty/release_duty?user=' + JSON.stringify(user) + '&specific_duty=' + JSON.stringify(specificDuty)).end(function(err, res) {
      assert.equal(res.status, 200);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.equal(result.status, 'FAILED');
      done();
    });
  });

  it('can release duty that belongs to the user', function(done) {
    passportStub.login({ name: 'admin' });

    user = {id: 1};
    specificDuty = {duty_id: 1,day: 1, month: 1, year: 1};

    agent.get(URL_ROOT + '/duty/release_duty?user=' + JSON.stringify(user) + '&specific_duty=' + JSON.stringify(specificDuty)).end(function(err, res) {
      assert.equal(res.status, 200);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.equal(result.status, 'OK');

      Duty.getSupervisorId(specificDuty, function(freeSlot, supervisorId) {
        assert.equal(freeSlot, true);
        assert.equal(supervisorId, 1);
        done();
      });

    });
  });

  it('can grab duty that is free', function(done) {
    passportStub.login({ name: 'admin' });

    user = {id: 1};
    specificDuty = {duty_id: 1,day: 1, month: 1, year: 1};

    agent.get(URL_ROOT + '/duty/grab_duty?user=' + JSON.stringify(user) + '&specific_duty=' + JSON.stringify(specificDuty)).end(function(err, res) {
      assert.equal(res.status, 200);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.equal(result.status, 'OK');
      
      Duty.getSupervisorId({duty_id: 1,day: 1, month: 1, year: 1}, function(freeSlot, supervisorId) {
        assert.equal(freeSlot, false);
        assert.equal(supervisorId, 1);
        done();
      });

    });
  });
});