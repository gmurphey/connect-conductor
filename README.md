# Conductor

Conductor is highly configurable routing middleware for Connect.

[![Build Status](https://travis-ci.org/gmurphey/connect-conductor.png?branch=master)](https://travis-ci.org/gmurphey/connect-conductor)

## Options

Some contrived examples:

```javascript
{
  routes: {
    '/':                    '/path/to/route/to',      // static routing
    '/assets/css/*path':    '/dist/css/[path]',       // wildcard routes
    '/api/:version/*path':  '/api/v[version]/[path]', // named routes
    '/assets/js/*path':     '/dist/[site]/js/[path]', // `site` routekey usage
    '/sites/:site/*path':   '/[site]/[path]'          // the `site` placeholder in the request takes precedence over routekeys
  }

  // can be overridden for individual requests
  routekeys: {
    'site': function (request) {
      return 'mysite';
    }
  }
}
```

## Using With Grunt

```javascript
// gruntfile definitions

connect: {
  options: {
    middleware: function (connect, options) {
      return [
        require('connect-conductor').route(options),
        // other middleware
      ]
    },

    routes: {
      // define routes
    },

    routekeys: {
      // define route keys
    }
  }
}
```
