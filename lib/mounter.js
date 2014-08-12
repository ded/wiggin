var when = require('when')
  , v = require('valentine')
  , path = require('path')
  , sequence = require('when/sequence')

function controllerFactory(controllerPath, controllerName) {
  return require(path.normalize(controllerPath + '/' + controllerName + '-controller'))
}

function getRouteHandler(app, Controller, route) {

  return function (req, res, next) {
    var controller = new Controller(app)
      , action = controller[route.action]
    req.originalRoute = route
    controller.req = req
    controller.res = res
    runBeforeFilters(controller, route, next)
    .then(function () {
      action.call(controller, next)
    })
    .otherwise(next)
  }
}

function runBeforeFilters(controller, route, next) {
  return when.promise(function (resolve, reject) {
    var promiseFilters = []
    controller.beforeFilters.forEach(function (filter) {
      var action = v.is.array(filter.action) ? filter.action : [filter.action]
      if (v.inArray(action, route.action) || v.inArray(action, '*')) {
        promiseFilters.push(filter.handler.bind(controller, next))
      }
    })
    sequence(promiseFilters).then(resolve).otherwise(reject)
  })
}

function mount(app, routes, mounter) {
  var Controller
    , handler

  routes.forEach(function (route) {
    try {
      Controller = controllerFactory(app.locals.config.controllers, route.controller)
    } catch (ex) {
      if (ex.code == 'MODULE_NOT_FOUND') {
        throw new Error(route.controller + ' Controller not found')
      }
    }
    handler = getRouteHandler(app, Controller, route)
    mounter(route.method, encodeURI(route.path), handler)
  })
}

module.exports = mount
