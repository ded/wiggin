/**
 * wraps the contents of a node sync commonJs module
 * providing the `module.exports` so it works in the browser
 * loosely based on Modules 1.1 spec
 * http://wiki.commonjs.org/wiki/Modules/1.1
 */

var path = require('path')
  , fs = require('fs')
  , convertToCommonJsModule = require('../lib/convert-to-commonjs-module')
function init(rootDir) {

  function protect(p) {
    var normalizedPath = path.normalize(p.replace(/[^\w-\/_]/g, ''))
    return rootDir + normalizedPath.replace(/js(on)?$/, '.js$1')
  }

  return function (req, res, next) {
    var pathToModule = protect(req.path)
    fs.readFile(pathToModule, 'utf8', function (err, data) {
      if (err) {
        var error = new Error(err)
        error.status = 404
        return next(error)
      }
      res.type('text/javascript')
      res.send(convertToCommonJsModule(data, pathToModule))
    })
  }
}



module.exports.init = init
