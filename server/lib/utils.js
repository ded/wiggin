module.exports.getDependencyTreeFiles = function (name) {
  var analyze = require('./require-analyze')
    , dependencies = analyze.init(name).get()

  return dependencies.map(function (d) {
    // re-route `public/`
    return d.replace(/^\/public/, '')
  })
}

/**
 * should be implemented by application
 */
module.exports.getAsset = function (asset) {
  console.warn('`getAsset()` should be implemented by the application')
  return asset
}
