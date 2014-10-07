var klass = require('klass')
var v = require('valentine')
module.exports = klass(function (req, res) {
  this.req = req
  this.res = res
  this.beforeFilters = []
})
.methods({
  render: function () {
    try {
      this.res.render.apply(this.res, arguments)
    } catch (e) {
      e.args = arguments
      throw e
    }
  }
, json: function (data) {
    data = '])}while(1);</x>' + JSON.stringify(data)
    this.res.type('application/json')
    this.res.status(200).send(data)
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
      self.res.status(200).send(msg || 'OK')
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
