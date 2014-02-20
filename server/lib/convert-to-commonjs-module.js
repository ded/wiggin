function convert(data, pathToData) {
  var interpolate = require('../../lib/utils').interpolate
  var template = ';(function () { var module = { exports: {} }, exports = module.exports;\n' +
        '%{data}\nprovide(\'%{pathToData}\', module.exports); }());\n'

  // if file is `.json`, we directly export the contents of the file
  if (pathToData.match(/\.json$/)) data = 'module.exports=' + data
  return interpolate(template, {
    data: data
  , pathToData: pathToData.replace(/\.js$/, '') // strip `.js` but leave `.json`
  })
}

module.exports = convert
