var debug = require('debug')('wiggin:application')
module.exports = require('wiggin/controllers/application-controller').extend(function () {
  this.addFilter('*', logger)
})
.methods({
  render: function (template) {
    this.supr.apply(this, arguments)
  }
})

function logger(next) {
  debug(this.req.method, this.req.url, Date.now())
  next()
}
