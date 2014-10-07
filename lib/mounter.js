var v = require('valentine')
  , path = require('path')

function controllerFactory(controllerPath, controllerName) {
  return require(path.normalize(controllerPath + '/' + controllerName + '-controller'))
}

function getRouteHandlers(Controller, route) {
  return function (req, res, next) {
    var isErred = false
    var controller = new Controller(req, res)
    var action = controller[route.action]
    controller.beforeFilters.forEach(function (filter) {
      if (isErred) return;
      var action = v.is.array(filter.action) ? filter.action : [filter.action]
      if (v.inArray(action, route.action) || v.inArray(action, '*')) {
        filter.handler.call(controller, function (err) {
          if (err) {
            isErred = true
            next(err)
          }
        })
      }
    })
    if (!isErred) action.call(controller, next)
  }
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
    handler = getRouteHandlers(Controller, route)
    mounter(route.method, encodeURI(route.path), handler)
  })
}

module.exports = mount
