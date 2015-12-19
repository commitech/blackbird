var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var passportStub = require('passport-stub');
var Const = require('../const');

var URL_ROOT = 'http://localhost:3000/api/v1/user';

describe("User API Tests", function() {
  var User;
  var server;
  var agent;

  before(function() {

    app = require('../').app;
    models = require('../').models;
    server = require('../').server;

    User = models.User;

    passportStub.install(app);
    agent = superagent.agent();
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
      assert.equal(json.user.name, 'admin');
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

});
