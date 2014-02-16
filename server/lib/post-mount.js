module.exports = function (routes) {
  routes['/view/:path(*)'] = {
      get: 'application.partial'
    , template: ''
  }
  return routes
}
