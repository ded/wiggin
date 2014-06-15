module.exports = require('wiggin/controllers/application-controller').extend()
  .methods({
    home: function (next) {
      this.render('index')
    }
  })
