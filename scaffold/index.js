var wiggin = require('wiggin')


wiggin.config(require('./wiggin-conf.json'))

wiggin.mount({
  '/': {
    'get': 'home.show',
    'template': 'home/show'
  }
})

wiggin.init(function (server) {
  server.listen(3000, function () {
    console.log('listening on port %d', server.address().port)
  })
})
