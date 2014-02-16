var ApplicationController = require('server/controllers/application-controller')

module.exports = ApplicationController.extend()
  .methods({
    home: function (req, res) {
      this.render(req, res)
    }
  })
