/* global require: false, describe: false, beforeEach: false, it: false */
require('should');

describe('Conductor', function () {
  var conductor, req, res;

  beforeEach(function () {
    conductor = require('../lib/conductor');

    req = {
      url: ''
    };
  });

  it('should run without options', function (done) {
    var route = conductor.route();

    req.url = '/user';

    route(req, res, function () {
      req.url.should.equal('/user');
      done();
    });
  });

  it('should not update the url without routes', function (done) {
    var route = conductor.route({});

    req.url = '/user';

    route(req, res, function () {
      req.url.should.equal('/user');
      done();
    });
  });

  it('should not update the url with non-matching routes', function (done) {
    var route = conductor.route({
      routes: {
        '/api': '/api/4'
      }
    });

    req.url = '/';

    route(req, res, function () {
      req.url.should.equal('/');
      done();
    });
  });

  it('should redirect static routes', function (done) {
    var route = conductor.route({
      routes: {
        '/user': '/users'
      }
    });

    req.url = '/user';

    route(req, res, function () {
      req.url.should.equal('/users');
      done();
    });
  });

  it('should redirect with wildcard routes', function (done) {
    var route = conductor.route({
      routes: {
        '/user/*path': '/[path]'
      }
    });

    req.url = '/user/1/status';

    route(req, res, function () {
      req.url.should.equal('/1/status');
      done();
    });
  });

  it('should redirect with route keys', function (done) {
    var route = conductor.route({
      routes: {
        '/status': '/[user]/status'
      },

      routekeys: {
        'user': function () {
          return 'gmurphey';
        }
      }
    });

    req.url = '/status';

    route(req, res, function () {
      req.url.should.equal('/gmurphey/status');
      done();
    });
  });

  it('should redirect with named fragments', function (done) {
    var route = conductor.route({
      routes: {
        '/api/:version': '/[version]'
      }
    });

    req.url = '/api/1';

    route(req, res, function () {
      req.url.should.equal('/1');
      done();
    });
  });

  it('should override routekeys with fragment of the same name', function (done) {
    var route = conductor.route({
      routes: {
        '/api/:version/task/*path': '/api/v[version]/[path]'
      },

      routekeys: {
        'version': function () {
          return '2';
        }
      }
    });

    req.url = '/api/1/task/meetups';

    route(req, res, function () {
      req.url.should.equal('/api/v1/meetups');
      done();
    });

  });
});

