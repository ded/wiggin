var klass = require('klass')

module.exports = klass(function (app) {
  this.app = app
  this.beforeFilters = []
})
.methods({
  render: function (template, locals) {
    this.res.render(template, locals)
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
})
