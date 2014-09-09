var klass = require('klass')
var v = require('valentine')
module.exports = klass(function (app) {
  this.app = app
  this.beforeFilters = []
})
.methods({
  render: function () {
    try {
      this.res.render.apply(this.res, arguments)
    } catch(e) {
      e.params = arguments
      throw e
    }
   }
, json: function (data) {
    data = '])}while(1);</x>' + JSON.stringify(data)
    this.res.type('application/json')
    this.res.send(data)
  }
, addFilter: function (action, handler) {
    this.beforeFilters.push({
      action: action,
      handler: handler
    })
  }
, ok: function (msg) {
    var self = this
    return function () {
      self.res.send(200, msg || 'OK')
    }
  }
, result: function (template, extra) {
    var self = this
    return function (result) {
      var data = v.is.fun(extra) ? extra(result) : extra
      self.render(template, v.extend(result, data || {}))
    }
  }
})
