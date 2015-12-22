var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var passportStub = require('passport-stub');
var sequelizeFixtures = require('sequelize-fixtures');
var Const = require('../const');
var config = require('../config');

var URL_ROOT = 'http://localhost:3000/api/v1/user';

describe("User API Tests", function() {
  config.APP.STAGE = 'TESTING';
  var User;
  var server;
  var agent;

  before(function(done) {
    wagner = require('../').wagner;
    app = require('../').app;
    models = require('../').models;
    server = require('../').server;
    db = wagner.invoke(function(db) {
      return db;
    });

    User = models.User;

    passportStub.install(app);
    agent = superagent.agent();

    db.sync({ force: true }).then(function(e) {
      sequelizeFixtures.loadFile('fixtures/*.json', models).then(function() {
        done();
      });
    }, function(err) {
      console.log(err);
    });
    
  });

  afterEach(function() {
    passportStub.logout();
  });

  it('cannot login with invalid credentials', function(done) {
    var url = URL_ROOT + '/login';
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
    var url = URL_ROOT + '/login';
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

    agent.get(URL_ROOT + '/me').end(function(err, res) {
      assert.equal(res.status, 200);
      var json;
      assert.doesNotThrow(function() {
        json = JSON.parse(res.text);
      });

      assert.equal(json.status, 'OK');
      assert.equal(json.result.name, 'admin');
      done();
    });

  });

  it('can logout after login', function(done) {
    passportStub.login({ name: 'admin' });

    var logoutUrl = URL_ROOT + '/logout';
    agent.get(logoutUrl).
    end(function(err, res) {
      assert.equal(res.user, null);
      done();
    });
  });

  it('can fetch data from a specific user', function(done) {
    passportStub.login({ name: 'admin' });

    agent.get(URL_ROOT + '/get_user?id=2').end(function(err, res) {
      assert.equal(res.status, 200);
      var json;
      assert.doesNotThrow(function() {
        json = JSON.parse(res.text);
      });

      assert.equal(json.status, 'OK');
      assert.equal(json.result.id, 2);
      assert.equal(json.result.name, 'mctest');
      done();
    });
  });

  it('can get all users', function(done) {
    passportStub.login({ name: 'admin', is_admin: true});
    agent.get(URL_ROOT + '/get_all_users').end(function(err, res) {
      assert.equal(res.status, 200);
      var json;
      assert.doesNotThrow(function() {
        json = JSON.parse(res.text);
      });
      assert.equal(json.status, 'OK');
      assert.equal(json.result.length, 5);
      done();
    });
  })

  it('can add user', function(done) {
    passportStub.login({ name: 'admin', is_admin: true});
    user = {name: "test2",
            matric_number: "a0a020",
            contact: "12345678",
            email: "haha@haha",
            cell: "jail",
            position: "centreback"};
    agent.get(URL_ROOT + '/add_user?user=' + JSON.stringify(user) + '&password=gajah').end(function(err, res) {
      assert.equal(res.status, 200);
      var json;
      assert.doesNotThrow(function() {
        json = JSON.parse(res.text);
      });
      assert.equal(json.status, 'OK');
      assert.equal(json.result, 6);
      agent.get(URL_ROOT + '/get_all_users').end(function(err, res) {
        assert.equal(res.status, 200);
        var json;
        assert.doesNotThrow(function() {
          json = JSON.parse(res.text);
        });
        assert.equal(json.status, 'OK');
        assert.equal(json.result.length, 6);
        done();
      });
    });
  })

});
