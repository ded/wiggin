provide('client/controllers/application-controller', function () {
  var klass = require('klass')
  return klass()
  .methods({
    render: function (view, options) {
      $.id('doc').html(view(options || {}))
    }
  })
}())
