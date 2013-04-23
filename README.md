# Conductor

Conductor is highly configurable routing middleware for Connect.

## Options

Some contrived examples:

```javascript
{
  routes: {
    '/':                    '/path/to/route/to',      // static routing
    '/assets/css/*path':    '/dist/css/[path]',       // wildcard routes
    '/api/:version/*path':  '/api/v[version]/[path]', // named routes
    '/assets/js/*path':     '/dist/[site]/js/[path]', // routekey usage
    '/sites/:site/*path':   '/[site]/[path]'          // override the `site` routekey for this request
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
