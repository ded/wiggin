var BaseModel = require('wiggin/models/base-model')
var when = require('when')
module.exports = BaseModel.extend()
  .statics({
    show: function () {
      return when.resolve({
        title: 'Welcome to the wiggin Framework',
        pagetitle: 'Home'
      })
    }
  })
