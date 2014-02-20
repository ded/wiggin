## Wiggin
A web framework

### install
``` sh
$ npm install -g wiggin
```

### scaffold
``` sh
$ wiggin create
```

### setup
``` sh
$ npm install
```

### implement
``` js
// app.js
var wiggin = require('wiggin')

wiggin.config({
  'models': 'app/models',
  'views': 'app/views',
  'controllers': 'server/controllers',
  'assets': 'app/assets',
  'client': 'client',
  'app': 'app'
})

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
```

### scaffold
``` sh
$ wiggin build
```

### start your server
``` sh
$ DEBUG=wiggin:* node app
```
