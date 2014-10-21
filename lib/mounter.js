var v = require('valentine')
  , path = require('path')

function controllerFactory(controllerPath, controllerName) {
  return require(path.normalize(controllerPath + '/' + controllerName + '-controller'))
}

function getRouteHandlers(Controller, route) {
  function noop(f) { f() }
  return function (req, res, next) {
    var controller = new Controller(req, res)
    var action = controller[route.action]
    if (!action) throw new Error('Controller action not found ' + route.action)
    var filters = controller.beforeFilters.map(function (filter) {
      var action = v.is.array(filter.action) ? filter.action : [filter.action]
      if (v.inArray(action, route.action) || v.inArray(action, '*')) {
        return function (f) {
          filter.handler.call(controller, function (err) {
            f(err)
          })
        }
      } else {
        return noop
      }
    })
    if (!filters || !filters.length) return action.call(controller, next)
    v.series(filters, function (err) {
      if (!err) action.call(controller, next)
      else next(err)
    })
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
