/**
 * @fileoverview builds a client bundle for any given entry point
 */

var debug = require('debug')('wiggin:task')
  , path = require('path')
  , fs = require('fs')
  , uglify = require('uglify-js')
  , rimraf = require('rimraf')
  , mkdirp = require('mkdirp')
  , gzip = require('gzipme')
  , analyzer = require('../server/lib/require-analyze')
  , convertToCommonJsModule = require('../server/lib/convert-to-commonjs-module')
  , bundlePath = __dirname + '/../tmp/bundle/'

module.exports.bundle = function (appName, sharedPath) {
  var bundleMap = []
  var appFileName = appName.match(/\/(.+)$/)[1]
  var outputFile = './public/js/client/' + appFileName + '.min.js'
  var dependencyTree = analyzer.init(appName).get()
  // loop thru the dependency tree, convert each file to commonJs
  // then write them out to `tmp/bundle/`
  dependencyTree.forEach(function (file) {
    file = file.replace(/^\//, '')
    var dirname = path.dirname(file)
      , contents
    // writes file bundles to `tmp/bundle`
    mkdirp.sync(bundlePath + dirname)
    contents = fs.readFileSync(file, 'utf8')
    // "shared" modules need to `provide()` themselves
    if (file.match(new RegExp('^' + sharedPath))) {
      contents = convertToCommonJsModule(contents, file)
    }
    fs.writeFileSync(bundlePath + file, contents, 'utf8')
  })

  bundleMap = dependencyTree.map(function (f) {
    return path.normalize(bundlePath + f)
  })

  var result = uglify.minify(bundleMap)

  mkdirp.sync('./public/js/client')
  // writes out the bundled minified code
  fs.writeFileSync(outputFile, result.code)
  // creates a gzip file => app.min.js.gz
  gzip(outputFile)

  rimraf.sync(__dirname + '/../tmp')
  debug('successfully bundled %s', appName)
}
