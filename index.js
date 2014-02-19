exports = module.exports

var express = exports.express = require('express')
  , http = require('http')
  , jade = require('jade')
  , v = require('valentine')
  , debug = require('debug')('wiggin')
  , utils = require('./server/lib/utils')
  , router = require('./server/lib/router')
  , mounter = require('./app/lib/mounter')
  , app = exports.app = express()
  , server = exports.server = http.createServer(app)

// config for dev
app.configure('development', function () {
  app.use('/app', require('./server/middleware/common-module-request').init('app'))
  app.use('/client', express.static('client'))
  app.use('/assets', express.static('app/assets'))
  app.locals.dependencyTree = utils.getDependencyTreeFiles('client/app')
})

app.configure(function () {

  // sets HTML pretty printing in non-prod environments
  app.locals.pretty = process.env.NODE_ENV !== 'production'

  // view options
  app.engine('jade', jade.__express)
  app.set('view engine', 'jade')
  app.set('views', 'app/views')

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

  exports.mount = function (routes) {
    routes = require('./server/lib/post-mount')(routes)
    routes = router(routes)
    mounter(app, routes, function (method, path, callback) {
      app[method](path, callback)
    })
  }
})

app.configure('production', function () {
  app.enable('view cache')
})

exports.ApplicationController = require('./server/controllers/application-controller')
exports.FixtureController = require('./server/controllers/fixture-controller')
exports.BaseModel = require('./app/models/base-model')
exports.FixtureModel = require('./app/models/fixture-model')
