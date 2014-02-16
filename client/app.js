/**
 * @fileoverview main entry to application
 */

provide('client/app', function () {
  var app = window.app = $({})
    , page = require('page')
    , request = require('reqwest')
    , objects = {}

  // setup similar global environment to server
  window.v = require('valentine')

  app.get = function (key) {
    return objects[key]
  }

  app.set = function (key, val) {
    objects[key] = val
    return app
  }

  function run() {
    // setup view runtime lib
    require('client/lib/view-runtime')

    // load global mixins to use within partials
    require('*views/mixins/mixins')()

    // controllers
    // require('client/controllers/fixture-controller')

    // mount routes to client controllers
    wiggin.routes.forEach(function (route) {
      if (route.method !== 'get') return;
      var Controller = require('client/controllers/' + route.controller + '-controller')
      if (!Controller) return;
      var c = new Controller
      if (!c[route.action]) return;
      page(route.path, c[route.action].bind(c))
    })

    page.start({
        click: false
      , popstate: true
      , dispatch: true
    })

    $(window).on('click', function (e) {
      var route
      if (e.target && (route = e.target.getAttribute('data-route'))) {
        e.stop()
        request({
          url: '/view' + route,
          type: 'json',
          data: {
            params: e.target.getAttribute('data-route-params') || ''
          }
        })
        .then(function (response) {
          $.id('doc').html(response.html)
          if (response.pagetitle) document.title = response.pagetitle
          page.show(response.route, response)
        })
      }
    })

  }
  return {
    app: app,
    run: run
  }
}());
