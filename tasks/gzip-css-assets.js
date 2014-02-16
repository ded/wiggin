var gzip = require('gzipme')
  , debug = require('debug')('wiggin:task')
  , finder = require('findit')
  , v = require('valentine')
  , filesToGzip = []

module.exports.gzip = function (files, done) {
  debug('gzipping css files', files)
  v.parallel(files.map(function (f) {
    return function (fn) {
      gzip(f, null, null, fn)
    }
  }), done || function () {})
}

if (!module.parent) {
  finder.find('./public/css')
  .on('file', function (file) {
    if (file.match(/\.min\.css$/)) filesToGzip.push(file)
  })
  .on('end', function () {
    module.exports.gzip(filesToGzip)
  })

}
