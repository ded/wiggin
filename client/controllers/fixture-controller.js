provide('client/controllers/fixture-controller', function () {
  var ApplicationController = require('client/controllers/application-controller')
  return ApplicationController.extend()
    .methods({
      home: function (context) {}
    })
}())
