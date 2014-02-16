/**
 * @fileoverview builds javascript bundles based on the provided `bundles` array.
 * add more as appropriate.
 */
var bundles = [
  'client/app'
]
var bundler = require('./js-bundler')

bundles.forEach(function (path) {
  bundler.bundle(path)
})
