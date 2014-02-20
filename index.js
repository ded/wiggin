
exports = module.exports

var express = exports.express = require('express')
  , http = require('http')
  , jade = require('jade')
  , v = require('valentine')
  , debug = require('debug')('wiggin')
  , utils = require('./server/lib/utils')
  , router = require('./server/lib/router')
  , mounter = require('./lib/mounter')
  , postMount = require('./server/lib/post-mount')
  , app = exports.app = express()

app.locals.config = {}

exports.config = function (config) {
  v.extend(app.locals.config, config)
}

exports.init = function (callback) {
  // config for dev
  app.configure('development', function () {
    app.use('/app', require('./server/middleware/common-module-request').init(app.locals.config.app))
    app.use('/client', express.static(app.locals.config.client))
    app.use('/assets', express.static(app.locals.config.assets))
    // app.locals.dependencyTree = utils.getDependencyTreeFiles('client/app')
  })

  app.configure(function () {

    // sets HTML pretty printing in non-prod environments
    app.locals.pretty = process.env.NODE_ENV !== 'production'

    // view options
    app.engine('jade', jade.__express)
    app.set('view engine', 'jade')
    app.set('views', app.locals.config.views)

    app.use(express.static('public'))
    app.use(express.cookieParser('wiggin'))
    app.use(express.methodOverride())
    app.use(express.cookieSession({
      path: '/',
      httpOnly: true,
      maxAge: 900000
    }))

    // extend application locals with utilities
    v.extend(app.locals, { utils: utils })
  })

  app.configure('production', function () {
    app.enable('view cache')
  })
  callback(http.createServer(app))
}

exports.mount = function (routes) {
  app.locals.config.routes = routes
  routes = postMount(routes)
  routes = router(routes)
  mounter(app, routes, function (method, path, callback) {
    app[method](path, callback)
  })
}
