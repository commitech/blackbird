var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');
var passport = require('passport');
var bodyparser = require('body-parser');
var middleware = require('./middleware');
var Const = require('./const');

var URL_ROOT = 'http://localhost:3000';

describe("User API Tests", function() {
  var User;
  var server;
  var agent;

  before(function() {
    app = express();

    require('./db')(wagner);
    User = wagner.invoke(function(User) {
      return User;
    });

    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({
      extended: true
    }));

    app.get('*', middleware.loggedInOnly);

    app.use(require('./api')(wagner));

    server = app.listen(3000);

    agent = superagent.agent();
  });

  after(function() {
    server.close();
  });

  it('cannot login with invalid credentials', function(done) {
    var url = URL_ROOT + '/user/login';
    agent.post(url).send({
      username: 'admin',
      password: 'password2'
    }).
    end(function(err, res) {

      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });

      assert.equal(result.status, 'FAILED');
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
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });

      assert.equal(result.status, 'OK');
      done();
    });
  });

  it('connection persist after login', function(done) {
    var url = URL_ROOT + '/user/login';
    agent.post(url).send({
      username: 'admin',
      password: 'password'
    }).
    end(function(err, res) {
      agent.get(URL_ROOT + '/user/me').end(function(err, res) {
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });

        assert.equal(result.status, 'OK');
        assert.equal(result.user.name, 'admin');
        done();
      });
    });
  });

  it('can logout after login', function(done) {
    var loginUrl = URL_ROOT + '/user/login';
    agent.post(loginUrl).send({
      username: 'admin',
      password: 'password'
    }).
    end(function(err, res) {
      var logoutUrl = URL_ROOT + '/user/logout';
      agent.get(logoutUrl).
      end(function(err, res) {
        agent.get(URL_ROOT + '/user/me').end(function(err, res) {
          assert.equal(res.status, 200);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.equal(result.status, 'OK');
          done();
        });
      });
    });
  });

});

describe("Duty API test", function(){
  var User;
  var Duty;
  var server;
  var agent;

  before(function() {
    app = express();

    require('./db')(wagner);
    User = wagner.invoke(function(User) {
      return User;
    });
    Duty = wagner.invoke(function(Duty) {
      return Duty;
    });

    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({
      extended: true
    }));

    app.get('*', middleware.loggedInOnly);

    app.use(require('./api')(wagner));

    server = app.listen(3000);

    agent = superagent.agent();
  });

  after(function() {
    server.close();
  });

  it('cannot fetch data without logging in', function(done) {
    agent.get(URL_ROOT + '/duty/get_duty').end(function(err, res) {

      assert.equal(res.status, 200);
      var result;
      assert.doesNotThrow(function() {
        result = JSON.parse(res.text);
      });
      assert.equal(result.status, 'FAILED');
      assert.equal(result.comment, Const.MESSAGE.NOT_LOGGED_IN);
      done();
    });
  });

  it('can fetch data', function(done) {
    var loginUrl = URL_ROOT + '/user/login';
    agent.post(loginUrl).send({
      username: 'admin',
      password: 'password'
    }).end(function(){
      agent.get(URL_ROOT + '/duty/get_duty?id=1').end(function(err, res) {
        assert.equal(res.status, 200);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.status, 'OK');
        assert.equal(result.result, {id: 1, 
                                     day_name: 'Monday', 
                                     start_time: '08:00:00',
                                     end_time: '08:30:00',
                                     location: 'yih'});
        done();
      });
    });
  });


});

