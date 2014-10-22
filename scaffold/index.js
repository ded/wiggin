var wiggin = require('wiggin')

wiggin.config(require('./wiggin-conf.json'))

wiggin.mount({
  '/': {
    'methods': {
      'get': 'home.show'
    }
  }
})

wiggin.init(require('http'), function (server) {
  server.listen(process.env.PORT || 3000, function () {
    console.log('listening on port %d', server.address().port)
  })
})
