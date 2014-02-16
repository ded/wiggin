var debug = require('debug')('wiggin:task')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , rimraf = require('rimraf')
  , convert = require('../server/lib/convert-to-commonjs-module')
  , findit = require('findit')
  , path = require('path')
  , v = require('valentine')
  , files = []

module.exports.write = function write(base, outDir, views, callback) {
  v(views).each(function (view, index) {
    var contents = fs.readFileSync(view, 'utf8')
      , viewPath = view.substring(base.length)
      , out = convert('module.exports=' + contents, '*views' + viewPath)

    mkdirp.sync(path.join(outDir + path.dirname(viewPath)))
    // make mixins accessible on `mixins` namespace
    // before:    var foo_bar_mixin = function () { ... }
    // after:     mixins.foo_bar = function () { ... }
    out = out.replace(/var ([\w\-_]+)_mixin = function/g, function (_, name) {
      return 'mixins.' + name + ' = function'
    })

    // call appropriate mixin from within a partial who doesn't directly
    // include the mixin
    // before:   foo_mixin.call(this)
    // after:    mixins.foo.call(this)
    out = out.replace(/([\w\-_]+)_mixin.call/g, function (_, name) {
      return 'mixins.' + name + '.call'
    })

    // rename calls to local mixins who don't use `.call()`
    // before:   foo_mixin()
    // after:    mixins.foo()
    out = out.replace(/([\w\-_]+)_mixin\(([^)]*)\)/g, function (_, name, args) {
      return 'mixins.' + name + '(' + (args || '') + ')'
    })
    fs.writeFile(outDir + viewPath, out, 'utf8', function (err) {
      if (err) debug('unable to write %s', path.join(outDir, viewPath))
      if (views.length - 1 == index && callback) callback()
    })
  })

}

if (!module.parent) {
  findit.find('app/views')
  .on('file', function (file) {
    if (/\.js$/.test(file)) files.push(file)
  })
  .on('end', function () {
    module.exports.write('app/views', 'public/js/views/', files, function () {
      files.forEach(rimraf.sync)
    })
  })
}
