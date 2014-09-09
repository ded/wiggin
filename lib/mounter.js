var when = require('when')
  , v = require('valentine')
  , path = require('path')

function controllerFactory(controllerPath, controllerName) {
  return require(path.normalize(controllerPath + '/' + controllerName + '-controller'))
}

function getRouteHandlers(app, Controller, route) {
  var controller = new Controller(app)
  var action = controller[route.action]
  var actions = compileFilters(controller, route)
  actions.push(function main(req, res, next) {
    req.originalRoute = route
    controller.req = req
    controller.res = res
    action.call(controller, next)
  })
  return actions
}

function compileFilters(controller, route) {
  var filters = []
  controller.beforeFilters.forEach(function (filter) {
    var action = v.is.array(filter.action) ? filter.action : [filter.action]
    if (v.inArray(action, route.action) || v.inArray(action, '*')) {
      filters.push(function middle(req, res, next) {
        req.originalRoute = route
        controller.req = req
        controller.res = res
        filter.handler.call(controller, next)
      })
    }
  })
  return filters
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
    handlers = getRouteHandlers(app, Controller, route)
    mounter(route.method, encodeURI(route.path), handlers)
  })
}

module.exports = mount
