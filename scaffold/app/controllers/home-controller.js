module.exports = require('app/controllers/application-controller').extend()
.methods({
  show: function (next) {
    this.render('home/show', {
      title: 'Welcome to the Wiggin Framework'
    })
  }
})
