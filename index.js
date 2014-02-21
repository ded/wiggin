var express = module.exports.express = require('express')
  , http = require('http')
  , jade = require('jade')
  , v = require('valentine')
  , utils = require('./server/lib/utils')
  , router = require('./server/lib/router')
  , mounter = require('./lib/mounter')
  , postMount = require('./server/lib/post-mount')
  , app = module.exports.app = express()

app.locals.config = {}
app.locals.bundles = {}
app.locals.useCDN = process.env.useCDN ? JSON.parse(process.env.useCDN) : false

module.exports.config = function (config) {
  v.extend(app.locals.config, config)
}

module.exports.use = function (middleware) {
  app.use(middleware)
}

module.exports.init = function (callback) {
  // config for dev
  app.configure('development', function () {
    app.use('/shared', require('./server/middleware/common-module-request').init(app.locals.config.shared))
    app.use('/client', express.static(app.locals.config.client))
    app.use('/assets', express.static(app.locals.config.assets));
    (app.locals.config.bundles || []).forEach(function (bundle) {
      app.locals.bundles[bundle] =  utils.getDependencyTreeFiles(bundle)
    })
  })

  app.configure(function () {

    // sets HTML pretty printing in non-prod environments
    app.locals.pretty = process.env.NODE_ENV !== 'production'

    // view options
    app.engine('jade', jade.__express)
    app.set('view engine', 'jade')
    app.set('views', app.locals.config.views)

    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(app.router)
    app.use(express.cookieParser('wiggin'))
    app.use(express.static(app.locals.config))

    // extend application locals with utilities
    v.extend(app.locals, { utils: utils })
  })

  app.configure('production', function () {
    app.enable('view cache')
  })

  app.use(function (err, req, res, next) {
    // we may use properties of the error object
    // here and next(err) appropriately, or if
    // we possibly recovered from the error, simply next().
    res.render('500', {
      status: err.status || 500,
      error: err
    })
  })

  callback(http.createServer(app))
}

module.exports.mount = function (routes) {
  app.locals.config.routes = routes
  routes = postMount(routes)
  routes = router(routes)
  mounter(app, routes, function (method, path, callback) {
    app[method](path, callback)
  })
}
