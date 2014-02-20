var debug = require('debug')('wiggin:task')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , convert = require('../server/lib/convert-to-commonjs-module')
  , findit = require('findit')
  , path = require('path')
  , files = []

function write(base, outDir, views, callback) {
  views.forEach(function (view, index) {
    var contents = fs.readFileSync(view, 'utf8')
      , viewPath = view.substring(base.length)
      , out = convert('module.exports=' + contents, '*views' + viewPath)

    mkdirp.sync(path.join(outDir + path.dirname(viewPath)))
    fs.writeFile(outDir + viewPath, out, 'utf8', function (err) {
      if (err) debug('unable to write %s', path.join(outDir, viewPath))
      if (views.length - 1 == index && callback) callback()
    })
  })

}

module.exports.write = function (viewsFolder, out, callback) {
  findit.find(viewsFolder)
    .on('file', function (file) {
      if (/\.js$/.test(file)) files.push(file)
    })
    .on('end', function () {
      write(viewsFolder, out, files, function () {
        files.forEach(rimraf.sync)
        callback()
      })
    })
}
