var should = require('should');

describe('Conductor', function () {
  var conductor, options, req, res;

  beforeEach(function () {
    conductor = require('../lib/conductor');

    req = {
      url: ''
    }
  });

  it('should not update the url with no routes', function (done) {
    var route = conductor.route({});

    req.url = '/user';

    route(req, res, function () {
      req.url.should.equal('/user');
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
        '/user/*path': '/[1]'
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
        '/user/1/status': '/[user]/status'
      },

      routekeys: {
        'user': function (req) {
          return 'gmurphey';
        }
      }
    });

    req.url = '/user/1/status';

    route(req, res, function () {
      req.url.should.equal('/gmurphey/status');
      done();
    });
  });
});

