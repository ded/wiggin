module.exports.getDependencyTreeFiles = function (name) {
  var analyze = require('./require-analyze')
    , dependencies = analyze.init(name).get()

  return dependencies.map(function (d) {
    // re-route `public/`
    return d.replace(/^\/public/, '')
  })
}

module.exports.getAsset = function (asset) {
  return asset
}
