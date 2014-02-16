var BaseModel = require('app/models/base-model')
var when = require('when')
module.exports = BaseModel.extend()
  .statics({
    'fixture.home': function (req) {
      return when.resolve({
        title: 'Welcome to the wiggin Framework',
        pagetitle: 'Home'
      })
    }
  })
