# Conductor

Conductor is highly configurable routing middleware for Connect.

## Options

```javascript
{
  routes: {
    '/':                    '/path/to/route/to',           // static routing
    '/assets/css/*path':    '/dist/css/[path]',          // wildcard parameters
  }
}
```

```javascript
{
  routes: {
    'assets/css/*path': '/dist/[client]
  },

  routekeys: {
    'client': function (req) {
      var

      return req.hostname;
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
