module.exports = require('wiggin/controllers/application-controller').extend(function () {
  this.addFilter('*', require('wiggin').logger)
})
.methods({
  render: function (template) {
    this.supr.apply(this, arguments)
  }
})
