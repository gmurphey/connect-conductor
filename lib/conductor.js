exports.route = function (options) {
  var
    regexRouteMap = {},

    transformStringToRegex = function (str) {
      var optionalParam = /\((.*?)\)/g,
          namedParam    = /(\(\?)?:\w+/g,
          splatParam    = /\*\w+/g,
          escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

      str = str.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
          return optional ? match : '([^\/]+)';
        })
        .replace(splatParam, '(.*?)');

      return '^' + str + '$';
    },

    parseRoutes = function () {
      Object.keys(options.routes).forEach(function (key) {
        var val = options.routes[key];

        key = transformStringToRegex(key);
        regexRouteMap[key] = val;
      });

      return regexRouteMap || {};
    },

    findRouteForUrl = function (request) {
      var matchedRoute;

      regexRouteMap = parseRoutes();

      Object.keys(regexRouteMap).forEach(function (key) {
        var fragments = request.url.match(key);

        if (fragments) {
          fragments.forEach(function (val, i) {
            regexRouteMap[key] = regexRouteMap[key].replace('[' + i + ']', val);
          });

          Object.keys(options.routekeys || {}).forEach(function (var_key) {
            regexRouteMap[key] = regexRouteMap[key].replace('[' + var_key + ']', options.routekeys[var_key].call(this, request));
          });

          matchedRoute = regexRouteMap[key];
        }
      });

      return matchedRoute || null;
    };

  return function (request, response, next) {
    if (options && options.routes) {
      var matchedRoute = findRouteForUrl(request);

      if (matchedRoute) {
        request.url = matchedRoute;
        request.originalUrl = matchedRoute;
      }
    }

    next();
  };
};
