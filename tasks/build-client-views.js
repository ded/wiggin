var debug = require('debug')('wiggin:task')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , convert = require('../server/lib/convert-to-commonjs-module')
  , findit = require('findit')
  , path = require('path')
  , mixinReplacement = 'wiggin.mixins = wiggin.mixins || {}'
  , files = []

function write(base, outDir, views, callback) {
  views.forEach(function (view, index) {
    var contents = fs.readFileSync(view, 'utf8')
      , viewPath = view.substring(base.length)
      , out = convert('module.exports=' + contents, '*views' + viewPath)

    // replace local jade_mixin var to use global jade mixins ns
    out = out.replace(/var jade_mixins = \{\};/g, mixinReplacement)

    // make mixins accessible on `wiggin.mixins` namespace
    // before:    jade_mixins["form"] = function () { ... }
    // after:     wiggin.mixins["foo_bar"] = function () { ... }
    out = out.replace(/jade_mixins\[\"/g, 'wiggin.mixins["')

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
