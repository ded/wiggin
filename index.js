var express = module.exports.express = require('express')
  , pug = require('pug')
  , v = require('valentine')
  , utils = require('./server/lib/utils')
  , router = require('./server/lib/router')
  , mounter = require('./lib/mounter')
  , app = module.exports.app = express()
  , expressRouter = module.exports.router = express.Router()
  , debug = require('debug')('wiggin:app')

app.locals.config = {}
app.locals.bundles = {}
app.locals.useCDN = process.env.useCDN ? JSON.parse(process.env.useCDN) : false

module.exports.config = function (config) {
  v.extend(app.locals.config, config)
}

module.exports.use = function (middleware) {
  return expressRouter.use(middleware)
}

module.exports.logger = function (next) {
  debug(this.req.method + '::' + this.req.url, Date.now())
  next()
}

module.exports.init = function (transport, callback) {
  expressRouter.use('/shared', require('./server/middleware/common-module-request').init(app.locals.config.shared))
  expressRouter.use('/client', express.static(app.locals.config.client));
  (app.locals.config.bundles || []).forEach(function (bundle) {
    app.locals.bundles[bundle] = utils.getDependencyTreeFiles(bundle)
  })

  // view options
  app.engine('pug', pug.__express)
  app.set('view engine', 'pug')
  app.set('views', app.locals.config.views)

  // extend application locals with utilities
  v.extend(app.locals, { utils: utils })

  if (process.env.NODE_ENV == 'production') app.enable('view cache')
  callback(transport.createServer(app))
  app.use(expressRouter)
}

module.exports.mount = function (routes) {
  app.locals.config.routes = routes
  routes = router(routes)
  mounter(app, routes, function (method, path, callback) {
    expressRouter[method].call(expressRouter, path, callback)
  })
}
