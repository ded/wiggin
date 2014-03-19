var v = require('valentine')
module.exports = function (routes) {
  var out = []
  v(routes).each(function (path, route) {
    v(route.methods).each(function (method, callback) {
      var parts = callback.split('.')
      out.push({
        server: v.is.bool(route.server) ? route.server : false,
        path: path,
        method: method,
        controller: parts[0],
        action: parts[1] || 'index'
      })
    })
  })
  return out
}
