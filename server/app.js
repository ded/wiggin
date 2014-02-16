var express = module.exports.express = require('express')
  , http = require('http')
  , jade = require('jade')
  , v = require('valentine')
  , debug = require('debug')('wiggin')
  , utils = require('./server/lib/utils')
  , app = module.exports.app = express()
  , server = module.exports.server = http.createServer(app)

app.use(express.compress())
app.use(express.favicon())

// config for dev
app.configure('development', function () {
  app.use('/app', require('./server/middleware/common-module-request').init('app'))
  app.use('/config', require('./server/middleware/common-module-request').init('config'))
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
  app.use(express.cookieParser('expa'))
  app.use(express.methodOverride())
  app.use(express.cookieSession({
    path: '/',
    httpOnly: true,
    maxAge: 900000
  }))

  app.use(require('./server/middleware/populate-view-locals'))

  // extend application locals with utilities
  v.extend(app.locals, { utils: utils })

  var routes = require('config/routes.json')
    , router = require('./server/lib/router')
    , routes = require('./server/lib/post-mount')(routes)
    , mountedRoutes = router(routes)

  require('./app/lib/mounter')(app, mountedRoutes, function (method, path, callback) {
    console.log(method, path)
    app[method](path, callback)
  })
})

app.configure('production', function () {
  app.enable('view cache')
})

module.exports.ApplicationController = require('./server/controllers/application-controller')
module.exports.FixtureController = require('./server/controllers/fixture-controller')
module.exports.BaseModel = require('./app/models/base-model')
module.exports.FixtureModel = require('./app/models/fixture-model')
