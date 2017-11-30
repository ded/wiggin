var BaseModel = require('wiggin/models/base-model')
module.exports = BaseModel.extend()
  .statics({
    show: function () {
      return {
        title: 'Welcome to the wiggin Framework',
        pagetitle: 'Home'
      }
    }
  })
