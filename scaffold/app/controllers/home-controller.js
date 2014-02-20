module.exports = require('wiggin/controllers/application-controller').extend()
  .methods({
    home: function (req, res) {
      this.render(req, res)
    }
  })
