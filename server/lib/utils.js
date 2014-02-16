var crypto = require('crypto')

module.exports.getDependencyTreeFiles = function (name) {
  var analyze = require('./require-analyze')
    , dependencies = analyze.init(name).get()

  return dependencies.map(function (d) {
    // re-route `public/`
    return d.replace(/^\/public/, '')
  })
}

module.exports.md5 = function md5(value) {
  return crypto.createHash('md5').update(value).digest('hex')
}
