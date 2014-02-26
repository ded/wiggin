var v = require('valentine')
module.exports = function (routes) {
  var out = []
  v(routes).each(function (route, routeData) {
    v(routeData).each(function (method, controllerMethod) {
      var controllerParts = controllerMethod.split('.')
        , controllerName = controllerParts[0]
        , action = controllerParts[1]

      out.push({
        method: method
      , path: route
      , controller: controllerName
      , action: action
      })
    })
  })
  return out
}
