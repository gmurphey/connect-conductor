/* global exports: true */
exports.route = function (opts) {
  var
    namedParam = /:\w+/g,
    splatParam = /\*\w+/g,
    escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g,

    // converts route string to regex
    transformStringToRegex = function (str) {
      str = str.replace(escapeRegExp, '\\$&')
        .replace(namedParam, '([^\/]+)')
        .replace(splatParam, '(.*?)');

      return '^' + str + '$';
    },

    parseRoutes = function () {
      if (opts && opts.routes) {
        Object.keys(opts.routes || {}).forEach(function (key) {
          var val = opts.routes[key];

          opts.routes[key] = {
            "routeRegex": transformStringToRegex(key),
            "destination": val
          };
        });
      }
    },

    findRouteForUrl = function (req) {
      var route;

      Object.keys(opts.routes || {}).forEach(function (key) {
        var urlFragments = req.url.match(opts.routes[key].routeRegex) || [],
            routeFragments = key.match(opts.routes[key].routeRegex) || [],
            routekeys = opts.routekeys || {};

        if (urlFragments.length) {
          urlFragments = urlFragments.splice(1);
          routeFragments = routeFragments.splice(1);
          route = opts.routes[key].destination;

          for (var i = 0; i < urlFragments.length; i++) {
            if (routeFragments[i]) {
              routeFragments[i] = routeFragments[i].replace(/[:\*]/, '');
              routekeys[routeFragments[i]] = urlFragments[i];
            }
          }

          Object.keys(routekeys || {}).forEach(function (variable) {
            route = route.replace('[' + variable + ']', (routekeys[variable].call) ? routekeys[variable].call(this, req) : routekeys[variable]);
          });
        }
      });

      return route || null;
    };

  parseRoutes();

  return function (req, res, next) {
    if (opts) {
      var route = findRouteForUrl(req);

      if (route) {
        req.url = route;
        req.originalUrl = route;
      }
    }

    next();
  };
};
