var when = require('when')
  , v = require('valentine')

function defaultControllerFactory(controllerName) {
  return require('server/controllers/' + controllerName + '-controller')
}

function getRouteHandler(app, Controller, route) {

  var controller = new Controller(app)
    , action = controller[route.action] || controller.render

  return function (req, res, next) {
    runBeforeFilters(controller, route, arguments)
    .then(function () {
      action.call(controller, req, res, next)
    })
    .otherwise(next)
  }
}

function runBeforeFilters(controller, route, args) {
  return when.promise(function (resolve) {
    var promiseFilters = []
    controller.beforeFilters.forEach(function (filter) {
      var action = v.is.array(filter.action) ? filter.action : [filter.action]
      if (v.inArray(action, route.action) || route.action == '*') {
        promiseFilters.push(filter.handler.apply(controller, args))
      }
    })
    when.all(promiseFilters).then(resolve)
  })
}

function mount(app, routes, mounter, controllerFactory) {
  var Controller
    , handler

  controllerFactory = controllerFactory || defaultControllerFactory

  routes.forEach(function (route) {
    try {
      Controller = controllerFactory(route.controller)
    } catch (ex) {
      if (ex.code == 'MODULE_NOT_FOUND') {
        Controller = require('../../server/controllers/application-controller')
      }
    }
    handler = getRouteHandler(app, Controller, route)
    mounter(route.method, encodeURI(route.path), handler)
  })
}

module.exports = mount
