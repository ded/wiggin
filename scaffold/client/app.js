/**
 * @fileoverview main entry to application
 */

provide('client/app', function () {
  var app = window.app = $({})
    , objects = {}

  app.get = function (key) {
    return objects[key]
  }

  app.set = function (key, val) {
    objects[key] = val
    return app
  }

  function run() {
    // setup view runtime lib
    require('client/vendor/view-runtime')
  }
  return {
    app: app
  , run: run
  }
}());
