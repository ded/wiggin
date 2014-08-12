var when = require('when')
  , v = require('valentine')
  , path = require('path')
  , sequence = require('when/sequence')

function controllerFactory(controllerPath, controllerName) {
  return require(path.normalize(controllerPath + '/' + controllerName + '-controller'))
}

function getRouteHandlers(app, Controller, route) {
  var controller = new Controller(app)
  var action = controller[route.action]
  var actions = runBeforeFilters(controller, route, next)
  actions.push(function main(req, res, next) {
    req.originalRoute = route
    controller.req = req
    controller.res = res
    action.call(controller, next)
  })
}

function runBeforeFilters(controller, route, next) {
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
    handler = getRouteHandlers(app, Controller, route)
    mounter(route.method, encodeURI(route.path), handler)
  })
}

module.exports = mount
