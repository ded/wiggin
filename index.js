var express = module.exports.express = require('express')
  , http = require('http')
  , jade = require('jade')
  , v = require('valentine')
  , utils = require('./server/lib/utils')
  , router = require('./server/lib/router')
  , mounter = require('./lib/mounter')
  , app = module.exports.app = express()

var errorHandler = function (err, req, res, next) {
  res.render('500', {
    status: err.status || 500,
    error: err
  })
}

app.locals.config = {}
app.locals.bundles = {}
app.locals.useCDN = process.env.useCDN ? JSON.parse(process.env.useCDN) : false

module.exports.setErrorHandler = function (fn) {
  errorHandler = fn
}
module.exports.config = function (config) {
  v.extend(app.locals.config, config)
}

module.exports.use = function (middleware) {
  return app.use(middleware)
}

module.exports.init = function (callback) {

  app.use('/shared', require('./server/middleware/common-module-request').init(app.locals.config.shared))
  app.use('/client', express.static(app.locals.config.client));
  (app.locals.config.bundles || []).forEach(function (bundle) {
    app.locals.bundles[bundle] =  utils.getDependencyTreeFiles(bundle)
  })

  // sets HTML pretty printing in non-prod environments
  app.locals.pretty = process.env.NODE_ENV !== 'production'

  // view options
  app.engine('jade', jade.__express)
  app.set('view engine', 'jade')
  app.set('views', app.locals.config.views)

  app.use(app.router)
  app.use(express.static(app.locals.config['public'] || 'public'))

  // extend application locals with utilities
  v.extend(app.locals, { utils: utils })

  app.configure('production', function () {
    app.enable('view cache')
  })

  app.use(errorHandler)

  callback(http.createServer(app))
}

module.exports.mount = function (routes) {
  app.locals.config.routes = routes
  routes = router(routes)
  mounter(app, routes, function (method, path, callback) {
    app[method](path, callback)
  })
}
