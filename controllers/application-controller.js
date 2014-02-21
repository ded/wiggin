var fs = require('fs')
  , p = require('path')
  , klass = require('klass')
  , jade = require('jade')
  , qs = require('qs')
  , v = require('valentine')

module.exports = klass(function (app) {
  this.app = app
  this.beforeFilters = []
})
.methods({
  render: function (req, res, next) {
    var modelAction = this.app.locals.config.routes[req.route.path][req.method.toLowerCase()]
    var modelParts = modelAction.split('.')
    var model = modelParts[0]
    var action = modelParts[1]
    var Model = require(this.app.locals.config.models + '/' + model + '-model')

    function success(locals) {
      res.render(this.app.locals.config.routes[req.route.path].template, locals)
    }

    function reject(reason) {
      reason.status = 500
      next(reason)
    }

    Model[action](req)
      .then(success.bind(this))
      .otherwise(reject)
  }
, json: function (req, res, data) {
    data = '])}while(1);</x>' + JSON.stringify(data)
    res.type('application/json')
    res.send(data)
  }
, addFilter: function (action, handler) {
    this.beforeFilters.push({
      action: action,
      handler: handler
    })
  }
, partial: function (req, res) {
    req.query.params = qs.parse(req.query.params)
    var self = this
    var path = '/' + req.params.path
    var paramPath = path
    var canonicalPath = path
    v(req.query.params).each(function (key, val) {
      paramPath += '/:' + key
      canonicalPath += '/' + val
    })

    var routeParamsPath = this.app.locals.config.routes[paramPath]
    var template = p.normalize(this.app.locals.config.views + '/' + routeParamsPath.template + '.jade')
    var modelAction = routeParamsPath[req.method.toLowerCase()]
    var modelParts = modelAction.split('.')
    var Model = require(this.app.locals.config.models + '/' + modelParts[0] + '-model')
    var source = fs.readFileSync(template, 'utf8')
    var sequence = false
    var block = source.split('\n').filter(function (line) {
      if (line.match(/^block content/)) sequence = true
      if (sequence && (line.match(/^\s/) || line.match(/^block content/))) {
        return line.match(/^\s/)
      } else {
        return sequence = false
      }
    })
    .map(function (line) {
      return line.replace(/^  /, '')
    })
    .join('\n')
    req.params = req.query.params
    Model[modelAction](req).then(function (locals) {
      var options = v.extend({ filename: template }, locals, self.app.locals, res.locals)
      var html = jade.render(block, options)
      res.json({
        html: html,
        pagetitle: options.pagetitle,
        route: canonicalPath
      })
    })
  }
})
