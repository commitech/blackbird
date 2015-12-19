var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');
var passport = require('passport');
var passportStub = require('passport-stub');
var bodyparser = require('body-parser');
var middleware = require('./middleware');
var Const = require('./const');

var URL_ROOT = 'http://localhost:3000/api/v1';

describe("API Tests", function() {
  var User;
  var Duty;
  var GrabbedDuty;
  var ReleasedDuty;
  var server;
  var agent;

  before(function() {

    app = require('.').app;
    models = require('.').models;
    server = require('.').server;

    User = models.User;
    Duty = models.Duty;
    GrabbedDuty = models.GrabbedDuty;
    ReleasedDuty = models.ReleasedDuty;

    passportStub.install(app);
    agent = superagent.agent();
  });

  after(function() {
    server.close();
  });

  afterEach(function() {
    passportStub.logout();
  })

  describe("User API Tests", function() {

    it('cannot login with invalid credentials', function(done) {
      var url = URL_ROOT + '/user/login';
      agent.post(url).send({
        username: 'admin',
        password: 'password2'
      }).
      end(function(err, res) {
        var json;
        assert.doesNotThrow(function() {
          json = JSON.parse(res.text);
        });

        assert.equal(json.status, 'FAILED');
        done();
      });
    });

    it('can login with valid credentials', function(done) {
      var url = URL_ROOT + '/user/login';
      agent.post(url).send({
        username: 'admin',
        password: 'password'
      }).
      end(function(err, res) {
        assert.equal(res.status, 200);
        var json;
        assert.doesNotThrow(function() {
          json = JSON.parse(res.text);
        });

        assert.equal(json.status, 'OK');
        done();
      });
    });

    it('connection persist after login', function(done) {
      passportStub.login({ name: 'admin' });

      agent.get(URL_ROOT + '/user/me').end(function(err, res) {
        assert.equal(res.status, 200);
        var json;
        assert.doesNotThrow(function() {
          json = JSON.parse(res.text);
        });

        assert.equal(json.status, 'OK');
        assert.equal(json.user.name, 'admin');
        done();
      });

    });

    it('can logout after login', function(done) {
      passportStub.login({ name: 'admin' });

      var logoutUrl = URL_ROOT + '/user/logout';
      agent.get(logoutUrl).
      end(function(err, res) {
        assert.equal(res.user, null);
        done();
      });
    });

  });

  describe("Duty API test", function(){

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
});