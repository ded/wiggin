var v = require('valentine')
module.exports = function (routes) {
  var out = []
  v(routes).each(function (route, routeData) {
    v(routeData).each(function (method, controllerMethod) {
      if (method == 'template') return;
      var controllerParts = controllerMethod.split('.')
        , controllerName = controllerParts[0]
        , action = controllerParts[1]

      out.push({
        method: method
      , path: route
      , controller: controllerName
      , action: action
      , template: routeData['template']
      })
    })
  })
  return app.locals.routes = out
}
